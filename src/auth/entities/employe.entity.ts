import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Jobs from './job.entity';
import { StatusEmployees } from './status_atr.entity';
import { TypesEmployees } from './type_atr.entity';
import Users from './user.entity';

@Entity({ name: 'employees' })
export default class Employees {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 500 })
  observations?: string;

  @Column('time')
  entry_time: string;

  @Column('time')
  departure_time: string;

  @Column('varchar', { length: 100 })
  days_to_work: string;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  hiring_date: Date;

  @OneToOne(() => Users)
  @JoinColumn()
  user: Users;

  @ManyToOne(() => TypesEmployees, (typeemploye) => typeemploye.employees)
  type_employe: TypesEmployees;

  @ManyToOne(() => StatusEmployees, (statusemploye) => statusemploye.employees)
  status_employe: StatusEmployees;

  @ManyToOne(() => Jobs, (job) => job.enployees)
  job: Jobs;
}
