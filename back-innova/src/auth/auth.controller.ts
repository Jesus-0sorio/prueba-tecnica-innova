import {
  Body,
  Controller,
  Post,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/user/entity/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Request() req) {
    const userEntity = await this.authService.validateUser(
      req.body.email,
      req.body.password,
    );

    if (!userEntity) {
      return new UnauthorizedException();
    }
    return this.authService.login(userEntity);
  }

  @Post('register')
  async register(@Body() body: User) {
    return this.authService.register(body);
  }
}
