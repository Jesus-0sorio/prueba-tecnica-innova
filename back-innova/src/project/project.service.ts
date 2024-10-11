import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entity/project.entity';
import { Repository } from 'typeorm';
import { ResponseRequest } from 'src/interfaces/Response.interface';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async findAll(): Promise<ResponseRequest<Project[] | null>> {
    try {
      const res = await this.projectRepository
        .find({
          relations: ['user'],
          order: { id: 'ASC' },
        })
        .then((projects: Project[]) => {
          return projects.map((project) => {
            delete project.user.password;
            return project;
          });
        });

      if (res.length === 0) {
        return {
          status: 404,
          message: 'Projects not found',
          data: null,
        };
      }

      return {
        status: 200,
        message: 'Projects found',
        data: res,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findOne(id: number): Promise<ResponseRequest<Project | null>> {
    try {
      const res = await this.projectRepository.findOne({ where: { id } });

      if (!res) {
        return {
          status: 404,
          message: 'Project not found',
          data: null,
        };
      }

      return {
        status: 200,
        message: 'Project found',
        data: res,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async create(project: Partial<Project>): Promise<ResponseRequest<Project>> {
    try {
      const res = await this.projectRepository.save(project);

      return {
        status: 201,
        message: 'Project created',
        data: res,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async update(
    id: number,
    project: Partial<Project>,
  ): Promise<ResponseRequest<Project | null>> {
    try {
      const pastProject = await this.projectRepository.findOne({
        where: { id },
      });

      if (!pastProject) {
        return {
          status: 404,
          message: 'Project not found',
          data: null,
        };
      }

      await this.projectRepository.update(id, project);

      const updatedProject = await this.projectRepository.findOne({
        where: { id },
      });

      return {
        status: 200,
        message: 'Project updated',
        data: updatedProject,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async remove(id: number): Promise<ResponseRequest<null>> {
    try {
      const project = await this.projectRepository.findOne({ where: { id } });

      if (!project) {
        return {
          status: 404,
          message: 'Project not found',
          data: null,
        };
      }

      await this.projectRepository.delete(id);

      return {
        status: 200,
        message: 'Project removed',
        data: null,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
