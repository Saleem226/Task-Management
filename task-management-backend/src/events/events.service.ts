import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventLog, EventLogDocument } from './schemas/event-log.schema';
import { UserPayload } from '../auth/auth.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(EventLog.name) private eventModel: Model<EventLogDocument>,
  ) {}

  async logEvent(
    taskId: string,
    action: 'create' | 'update' | 'delete',
    user: UserPayload,
    details: Record<string, any>,
  ): Promise<void> {
    const event = new this.eventModel({
      taskId,
      action,
      userId: user.userId,
      userEmail: user.email,
      userRole: user.role,
      details,
    });
    await event.save();
  }

  async getEvents(taskId: string | undefined): Promise<EventLog[]> {
    const query = taskId ? { taskId } : {};

    return this.eventModel.find(query).sort({ createdAt: -1 }).lean().exec();
  }
}
