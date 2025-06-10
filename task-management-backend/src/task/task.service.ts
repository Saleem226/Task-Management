import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto, UpdateTaskDto } from './task.dto';
import { UserRole } from '../users/user.entity';
import { UserPayload } from 'src/auth/auth.dto';
import { TaskGateway } from '../websocket/websocket.gateway';
import { EventsService } from 'src/events/events.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private taskGateway: TaskGateway,
    private eventLogService: EventsService,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: UserPayload): Promise<Task> {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can create tasks');
    }
    const task = this.taskRepository.create({
      ...createTaskDto,
      assignedTo: { id: createTaskDto.assignedToId },
    });
    const savedTask = await this.taskRepository.save(task);
    this.taskGateway.emitTaskEvent(
      'created',
      savedTask,
      createTaskDto.assignedToId,
    );
    await this.eventLogService.logEvent(savedTask.id, 'create', user, {
      message: 'Task created by admin',
    });
    return savedTask;
  }

  async findAll(user: UserPayload): Promise<Task[]> {
    if (user.role === UserRole.ADMIN) {
      return this.taskRepository.find();
    }
    return this.taskRepository.find({
      where: { assignedTo: { id: user.userId } },
    });
  }

  async findOne(id: string, user: UserPayload): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['assignedTo'],
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    if (user.role !== UserRole.ADMIN && task.assignedTo.id !== user.userId) {
      throw new ForbiddenException('Access denied');
    }
    return task;
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: UserPayload,
  ): Promise<Task> {
    const task = await this.findOne(id, user);
    const newAssignedToId = updateTaskDto.assignedToId
      ? updateTaskDto.assignedToId
      : task.assignedTo.id;

    const updatedTask = await this.taskRepository.save({
      ...task,
      ...updateTaskDto,
      assignedTo: { id: newAssignedToId },
    });

    this.taskGateway.emitTaskEvent('updated', updatedTask, newAssignedToId);

    await this.eventLogService.logEvent(task.id, 'create', user, {
      message: 'Task updated',
    });
    return updatedTask;
  }

  async delete(id: string, user: UserPayload): Promise<void> {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can delete tasks');
    }
    const task = await this.findOne(id, user);
    await this.taskRepository.remove(task);
    await this.eventLogService.logEvent(task.id, 'create', user, {
      message: 'Task deleted',
    });
    this.taskGateway.emitTaskEvent('deleted', task, task.assignedTo.id);
  }
}
