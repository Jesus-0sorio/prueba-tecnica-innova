import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/utils/role.enum';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { User } from './entity/user.entity';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard)
@Roles(Role.Admin)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Roles(Role.User, Role.Admin)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() user: Partial<User>,
  ) {
    if (req.user.role === Role.User && req.user.id !== +id) {
      return {
        message: 'You are not allowed to update other user data',
        status: 403,
        data: null,
      };
    }

    return this.userService.update(+id, user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
