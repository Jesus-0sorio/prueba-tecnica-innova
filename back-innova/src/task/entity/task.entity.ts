import { User } from '../../user/entity/user.entity';
import { Project } from '../../project/entity/project.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  status: string;

  @ManyToOne(() => User, (user) => user.tasks, {
    onDelete: 'SET NULL',
    eager: false,
  })
  user: User;

  @ManyToOne(() => Project, (project) => project.tasks, {
    onDelete: 'CASCADE',
    eager: false,
  })
  project: Project;

  @Column({ nullable: true })
  userId: number;

  @Column({ nullable: true })
  projectId: number;
}
