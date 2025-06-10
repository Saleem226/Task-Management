import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from './users/user.entity';
import { Task } from './task/task.entity';

const configService = new ConfigService();

export const SeedDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('database.postgres.host'),
  port: configService.get<number>('database.postgres.port'),
  username: configService.get('database.postgres.username'),
  password: configService.get('database.postgres.password'),
  database: configService.get('database.postgres.db'),
  entities: [User, Task],
  synchronize: false,
});
