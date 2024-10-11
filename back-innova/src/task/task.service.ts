import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entity/task.entity';
import { ResponseRequest } from 'src/interfaces/Response.interface';
import { TaskDto } from './dto/task.dto';
import { Role } from 'src/auth/utils/role.enum';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  public async findAll(): Promise<ResponseRequest<Task[] | null>> {
    try {
      const res = await this.taskRepository
        .find({
          relations: ['project', 'user'],
          order: { id: 'ASC' },
        })
        .then((tasks: Task[]) => {
          return tasks;
        });

      if (res.length === 0) {
        return {
          status: 404,
          message: 'Tasks not found',
          data: null,
        };
      }

      return {
        status: 200,
        message: 'Tasks found',
        data: res,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findMyTasks(user_id: number): Promise<ResponseRequest<Task[] | null>> {
    try {
      const res = await this.taskRepository
        .find({
          where: { userId: user_id },
          relations: ['project'],
          order: { id: 'ASC' },
        })
        .then((tasks: Task[]) => {
          return tasks;
        });

      if (res.length === 0) {
        return {
          status: 404,
          message: 'Tasks not found',
          data: null,
        };
      }

      return {
        status: 200,
        message: 'Tasks found',
        data: res,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findOne(id: number): Promise<ResponseRequest<Task | null>> {
    try {
      const res = await this.taskRepository.findOne({
        where: { id },
      });

      if (!res) {
        return {
          status: 404,
          message: 'Task not found',
          data: null,
        };
      }

      return {
        status: 200,
        message: 'Task found',
        data: res,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findByProjectId(
    project_id: number,
  ): Promise<ResponseRequest<Task[] | null>> {
    try {
      const res = await this.taskRepository.find({
        where: { project: { id: project_id } },
      });

      if (res.length === 0) {
        return {
          status: 404,
          message: 'Tasks not found',
          data: null,
        };
      }

      return {
        status: 200,
        message: 'Tasks found',
        data: res,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async create(task: TaskDto): Promise<ResponseRequest<Task>> {
    try {
      const newTask = await this.taskRepository.save(task);

      return {
        status: 201,
        message: 'Task created',
        data: newTask,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async update(
    id: number,
    task: Partial<TaskDto>,
    user_id: number,
    user_role: string,
  ): Promise<ResponseRequest<Task | null>> {
    try {
      const pastTask = await this.taskRepository.findOne({
        select: ['id', 'name', 'description', 'status', 'userId', 'projectId'],
        where: { id },
      });

      if (!pastTask) {
        return {
          status: 404,
          message: 'Task not found',
          data: null,
        };
      }

      if (pastTask.userId !== user_id && user_role !== Role.Admin) {
        return {
          status: 403,
          message: 'You do not have permission to update this task',
          data: null,
        };
      }

      await this.taskRepository.update(id, task);

      const updatedTask = await this.taskRepository.findOne({
        where: { id },
      });

      return {
        status: 200,
        message: 'Task updated',
        data: updatedTask,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateVarious(
    tasks: Partial<TaskDto>[],
    user_id: number,
    user_role: string,
  ): Promise<ResponseRequest<Task[] | null>> {
    try {
      const tasksUpdated: Task[] = [];

      for (const task of tasks) {
        const pastTask = await this.taskRepository.findOne({
          where: { id: task.id },
        });

        if (!pastTask) {
          return {
            status: 404,
            message: 'Task not found',
            data: null,
          };
        }

        if (pastTask.userId !== user_id && user_role !== Role.Admin) {
          return {
            status: 403,
            message: 'You do not have permission to update this task',
            data: null,
          };
        }

        await this.taskRepository.update(task.id, task);

        const updatedTask = await this.taskRepository.findOne({
          where: { id: task.id },
        });

        tasksUpdated.push(updatedTask);
      }

      return {
        status: 200,
        message: 'Tasks updated',
        data: tasksUpdated,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async remove(
    id: number,
    user_id: number,
    user_role: string,
  ): Promise<ResponseRequest<null>> {
    try {
      const task = await this.taskRepository.findOne({ where: { id } });

      if (!task) {
        return {
          status: 404,
          message: 'Task not found',
          data: null,
        };
      }

      if (task.userId !== user_id && user_role !== Role.Admin) {
        return {
          status: 403,
          message: 'You do not have permission to remove this task',
          data: null,
        };
      }

      await this.taskRepository.delete(id);

      return {
        status: 200,
        message: 'Task removed',
        data: null,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async removeVarious(
    ids: number[],
    user_id: number,
    user_role: string,
  ): Promise<ResponseRequest<null>> {
    try {
      for (const id of ids) {
        const task = await this.taskRepository.findOne({ where: { id } });

        if (!task) {
          return {
            status: 404,
            message: 'Task not found',
            data: null,
          };
        }

        if (task.userId !== user_id && user_role !== Role.Admin) {
          return {
            status: 403,
            message: 'You do not have permission to remove this task',
            data: null,
          };
        }

        await this.taskRepository.delete(id);
      }

      return {
        status: 200,
        message: 'Tasks removed',
        data: null,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
