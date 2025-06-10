import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EventLog, EventLogSchema } from './schemas/event-log.schema';
import { TaskGateway } from 'src/websocket/websocket.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EventLog.name, schema: EventLogSchema },
    ]),
  ],
  controllers: [EventsController],
  providers: [TaskGateway, EventsService],
  exports: [EventsService, TaskGateway],
})
export class EventsModule {}
