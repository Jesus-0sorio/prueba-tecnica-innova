import { Project } from 'src/project/entity/project.entity';
import { Task } from 'src/task/entity/task.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @OneToMany(() => Project, (project) => project.user, {
    eager: false,
  })
  projects: Project[];

  @OneToMany(() => Task, (task) => task.user, {
    eager: false,
  })
  tasks: Task[];
}
