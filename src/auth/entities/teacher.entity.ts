import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Employees from './employe.entity';

@Entity({ name: 'teachers' })
export default class Teachers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 100, default: 'no introduction' })
  presentation: string;

  @Column('varchar', { length: 100 })
  speciality: string;

  @Column('varchar', { length: 20 })
  cubicle: string;

  @Column('float', { nullable: true })
  pass_rate: number;

  @Column('float', { nullable: true })
  failure_rate: number;

  @OneToOne(() => Employees)
  @JoinColumn()
  employe: Employees;
}
