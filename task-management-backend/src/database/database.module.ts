import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';
import { User } from 'src/users/user.entity';
import { Task } from 'src/task/task.entity';

@Module({
  imports: [
    ConfigModule,

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        entities: [User, Task],
        type: 'postgres',
        host: config.get('database.postgres.host'),
        port: config.get<number>('database.postgres.port'),
        username: config.get('database.postgres.username'),
        password: config.get('database.postgres.password'),
        database: config.get('database.postgres.db'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),

    // MongoDB Setup
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        uri: config.get('database.mongo'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
