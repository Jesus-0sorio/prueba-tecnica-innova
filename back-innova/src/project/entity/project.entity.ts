import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Task } from 'src/task/entity/task.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'date' })
  initial_date: Date;

  @Column({ type: 'date' })
  final_date: Date;

  @ManyToOne(() => User)
  user: User;

  @OneToMany(() => Task, (task) => task.project, { eager: false })
  tasks: Task[];

  @Column({ nullable: true })
  userId: number;
}
