import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
  ForbiddenException,
  Query,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserPayload } from '../auth/auth.dto';
import { Request } from 'express';
import { UserRole } from '../users/user.entity';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get('/')
  async getEvents(
    @Query('taskId') taskId: string | undefined,
    @Req() req: Request,
  ) {
    const user = req.user as UserPayload;
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can view event logs');
    }
    return this.eventsService.getEvents(taskId);
  }
}
