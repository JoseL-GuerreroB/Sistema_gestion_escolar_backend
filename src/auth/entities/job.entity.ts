import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import Employees from './employe.entity';

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

  @OneToMany(() => Employees, (employe) => employe.job)
  enployees: Employees[];
}
