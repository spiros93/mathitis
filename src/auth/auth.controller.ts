import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  [x: string]: any;

  @Post('login')
  async login(
    @Body(new ValidationPipe()) credentials: AuthDto,
  ): Promise<{access_token: string}>{
    return this.AuthService.login(credentials);
  }
}
