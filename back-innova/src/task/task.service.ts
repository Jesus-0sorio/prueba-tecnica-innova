import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entity/task.entity';
import { ResponseRequest } from 'src/interfaces/Response.interface';
import { TaskDto } from './dto/task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  public async findAll(): Promise<ResponseRequest<Task[] | null>> {
    try {
      const res = await this.taskRepository.find().then((tasks: Task[]) => {
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
          where: { user: { id: user_id } },
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

  async create(task: TaskDto): Promise<ResponseRequest<Partial<Task>>> {
    try {
      const newTask = await this.taskRepository.create({
        ...task,
        user: { id: task.user },
        project: { id: task.project },
      });

      const res = {
        id: newTask.id,
        name: newTask.name,
        description: newTask.description,
        status: newTask.status,
        userId: newTask.userId,
        projectId: newTask.projectId,
      };

      return {
        status: 201,
        message: 'Task created',
        data: res,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async update(
    id: number,
    task: Partial<TaskDto>,
    user_id: number,
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

      if (pastTask.userId !== user_id) {
        return {
          status: 403,
          message: 'You do not have permission to update this task',
          data: null,
        };
      }

      await this.taskRepository.update(id, {
        ...task,
        user: task.user ? { id: task.user } : undefined,
        project: task.project ? { id: task.project } : undefined,
      });

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

  async remove(id: number): Promise<ResponseRequest<null>> {
    try {
      const task = await this.taskRepository.findOne({ where: { id } });

      if (!task) {
        return {
          status: 404,
          message: 'Task not found',
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
}
