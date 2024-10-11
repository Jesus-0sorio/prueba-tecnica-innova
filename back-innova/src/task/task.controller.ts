import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/utils/role.enum';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { TaskService } from './task.service';
import { TaskDto } from './dto/task.dto';
import { ResponseRequest } from 'src/interfaces/Response.interface';
import { Task } from './entity/task.entity';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Roles(Role.User, Role.Admin)
  @Get('my')
  async findMyTasks(
    @Request() req,
    @Response() res,
  ): Promise<ResponseRequest<Task[] | null>> {
    const { userId: user_id } = req.user;

    const response = await this.taskService.findMyTasks(user_id);

    return res.status(response.status).json({
      ...response,
    });
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @Response() res,
  ): Promise<ResponseRequest<Task | null>> {
    const response = await this.taskService.findOne(id);

    return res.status(response.status).json({
      ...response,
    });
  }

  @Get()
  async findByProjectId(
    @Query('project_id') project_id: number,
    @Response() res,
  ): Promise<ResponseRequest<Task | null>> {
    const response = await this.taskService.findByProjectId(project_id);

    return res.status(response.status).json({
      ...response,
    });
  }
  @Post()
  async create(
    @Body() task: TaskDto,
    @Response() res,
  ): Promise<ResponseRequest<Task | null>> {
    const response = await this.taskService.create(task);

    return res.status(response.status).json({
      ...response,
    });
  }

  @Roles(Role.User, Role.Admin)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Request() req,
    @Body() task: Partial<TaskDto>,
    @Response() res,
  ): Promise<ResponseRequest<Task | null>> {
    const { userId: user_id, role: user_role } = req.user;

    const response = await this.taskService.update(
      id,
      task,
      user_id,
      user_role,
    );

    return res.status(response.status).json({
      ...response,
    });
  }

  @Roles(Role.User, Role.Admin)
  @Put()
  async updateVarious(
    @Request() req,
    @Body() tasks: TaskDto[],
    @Response() res,
  ): Promise<ResponseRequest<Task[] | null>> {
    const { userId: user_id, role: user_role } = req.user;

    const response = await this.taskService.updateVarious(
      tasks,
      user_id,
      user_role,
    );

    return res.status(response.status).json({
      ...response,
    });
  }

  @Roles(Role.User, Role.Admin)
  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @Request() req,
    @Response() res,
  ): Promise<ResponseRequest<null>> {
    const { userId: user_id, role: user_role } = req.user;

    const response = await this.taskService.remove(id, user_id, user_role);

    return res.status(response.status).json({
      ...response,
    });
  }

  @Roles(Role.User, Role.Admin)
  @Delete()
  async removeVarious(
    @Request() req,
    @Body() tasksIds: number[],
    @Response() res,
  ): Promise<ResponseRequest<null>> {
    const { userId: user_id, role: user_role } = req.user;

    const response = await this.taskService.removeVarious(
      tasksIds,
      user_id,
      user_role,
    );

    return res.status(response.status).json({
      ...response,
    });
  }
}
