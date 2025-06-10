import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { User } from 'src/users/user.entity';
import { Task } from 'src/task/task.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const postgresUrl = config.get<string>('POSTGRES_URL');
        if (postgresUrl) {
          return {
            type: 'postgres',
            url: postgresUrl,
            entities: [User, Task],
            synchronize: true,
          };
        }
        return {
          type: 'postgres',
          host: config.get('POSTGRES_HOST'),
          port: config.get<number>('POSTGRES_PORT'),
          username: config.get('POSTGRES_USER'),
          password: config.get('POSTGRES_PASSWORD'),
          database: config.get('POSTGRES_DB'),
          entities: [User, Task],
          autoLoadEntities: true,
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),

    // MongoDB Setup remains unchanged
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
