import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/utils/role.enum';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { TaskService } from './task.service';
import { TaskDto } from './dto/task.dto';

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
  findMyTasks(@Request() req) {
    return this.taskService.findMyTasks(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.taskService.findOne(id);
  }

  @Get()
  findByProjectId(@Query('project_id') project_id: number) {
    return this.taskService.findByProjectId(project_id);
  }
  @Post()
  create(@Body() task: TaskDto) {
    return this.taskService.create(task);
  }

  @Roles(Role.User, Role.Admin)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Request() req,
    @Body() task: Partial<TaskDto>,
  ) {
    const user_id = req.user.id;
    return this.taskService.update(id, task, user_id);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.taskService.remove(id);
  }
}
