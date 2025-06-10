import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Task } from '../task/task.entity';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
export type UserRoleType = keyof typeof UserRole;

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: 'USER',
  })
  role: UserRoleType;

  @OneToMany(() => Task, (task) => task.assignedTo)
  tasks: Task[];
}
