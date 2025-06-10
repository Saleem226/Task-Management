import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Task } from './task.entity';
import { TaskGateway } from 'src/websocket/websocket.gateway';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), AuthModule, EventsModule],
  providers: [TaskService, TaskGateway],
  controllers: [TaskController],
})
export class TaskModule {}
