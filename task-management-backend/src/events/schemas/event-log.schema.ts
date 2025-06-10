import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from 'src/users/user.entity';

export type EventLogDocument = EventLog & Document;

@Schema()
export class EventLog {
  @Prop()
  userId: string;

  @Prop()
  taskId: string;

  @Prop()
  action: string;

  @Prop({ default: Date.now })
  timestamp: Date;

  @Prop({ required: true })
  userEmail: string;

  @Prop({ required: true })
  userRole: UserRole;

  @Prop({ type: Object })
  details: Record<string, any>;
}

export const EventLogSchema = SchemaFactory.createForClass(EventLog);
