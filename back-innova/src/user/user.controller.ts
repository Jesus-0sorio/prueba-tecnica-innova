import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/utils/role.enum';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import { ResponseRequest } from 'src/interfaces/Response.interface';

@UseGuards(JwtAuthGuard)
@Roles(Role.Admin)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(@Response() res): Promise<ResponseRequest<User[] | null>> {
    const users = await this.userService.findAll();

    return res.status(users.status).json({
      ...users,
    });
  }

  @Get('role/:role')
  async findUsersByRole(
    @Param('role') role: string,
    @Response() res,
  ): Promise<ResponseRequest<User[] | null>> {
    const users = await this.userService.findUsersByRole(role);

    return res.status(users.status).json({
      ...users,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Response() res) {
    const user = await this.userService.findOne(+id);

    return res.status(user.status).json({
      ...user,
    });
  }

  @Roles(Role.User, Role.Admin)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() user: Partial<User>,
    @Response() res,
  ) {
    if (req.user.role === Role.User && req.user.id !== +id) {
      return res.status(401).json({
        status: 401,
        message: 'Unauthorized',
        data: null,
      });
    }

    const updatedUser = await this.userService.update(+id, user);

    return res.status(updatedUser.status).json({
      ...updatedUser,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Response() res) {
    const deletedUser = await this.userService.remove(+id);

    return res.status(deletedUser.status).json({
      ...deletedUser,
    });
  }
}
