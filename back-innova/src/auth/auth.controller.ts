import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Request,
  Response,
} from '@nestjs/common';
import { ResponseRequest } from 'src/interfaces/Response.interface';
import { User } from 'src/user/entity/user.entity';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Request() req, @Response() res) {
    const userEntity = await this.authService.validateUser(
      req.body.email,
      req.body.password,
    );

    if (!userEntity) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        status: 401,
        message: 'Unauthorized',
        data: null,
      });
    }

    const token = await this.authService.login(userEntity);

    return res.status(HttpStatus.OK).json({
      status: 200,
      message: 'User logged in',
      data: token,
    });
  }

  @Post('register')
  async register(@Body() body: User, @Response() res) {
    const user: ResponseRequest<User | null> =
      await this.authService.register(body);

    return res.status(user.status).json({
      ...user,
    });
  }
}
