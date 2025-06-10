import { Controller, Get, Body, Put, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserPayload } from 'src/auth/auth.dto';
import { CustomRequest } from 'src/types/express';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  findAll(@Request() req: CustomRequest) {
    return this.userService.findAll(req.user as UserPayload);
  }

  @Put('update')
  async updatePassword(
    @Body('password') password: string,
    @Request() req: CustomRequest,
  ) {
    await this.userService.updatePassword(password, req.user as UserPayload);
    return { message: 'Password updated successfully' };
  }
}
