import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import Employees from './employe.entity';
import { TypesJobs } from './type_atr.entity';

@Entity({ name: 'jobs' })
export default class Jobs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 15, unique: true })
  job: string;

  @Column('int', { width: 20 })
  salary: number;

  @Column('varchar', { length: 25 })
  salary_period: string;

  @ManyToOne(() => TypesJobs, (typejob) => typejob.jobs)
  type_job: TypesJobs;

  @OneToMany(() => Employees, (employe) => employe.job)
  enployees: Employees[];
}
