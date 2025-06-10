import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto } from './task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CustomRequest } from 'src/types/express';
import { UserPayload } from 'src/auth/auth.dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Request() req: CustomRequest) {
    return this.taskService.create(createTaskDto, req.user as UserPayload);
  }

  @Get()
  findAll(@Request() req: CustomRequest) {
    return this.taskService.findAll(req.user as UserPayload);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: CustomRequest) {
    return this.taskService.findOne(id, req.user as UserPayload);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req: CustomRequest,
  ) {
    return this.taskService.update(id, updateTaskDto, req.user as UserPayload);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req: CustomRequest) {
    return this.taskService.delete(id, req.user as UserPayload);
  }
}
