import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import { TaskGateway } from '../websocket/websocket.gateway';
import { EventsService } from 'src/events/events.service';
import { UserPayload } from 'src/auth/auth.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private taskGateway: TaskGateway,
    private eventLogService: EventsService,
  ) {}

  async findAll(user: UserPayload): Promise<User[]> {
    if (user.role !== UserRole.ADMIN) {
      throw new NotFoundException('Only admins can view all users');
    }
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.role = :role', { role: UserRole.USER })
      .select(['user.id', 'user.email', 'user.role']) // Exclude password
      .getMany();
  }

  async updatePassword(password: string, user: UserPayload): Promise<void> {
    const foundUser = await this.userRepository.findOne({
      where: { id: user.userId },
    });
    if (!foundUser) {
      throw new NotFoundException('User not found');
    }
    foundUser.password = await bcrypt.hash(password, 10);
    await this.userRepository.save(foundUser);
  }
}
