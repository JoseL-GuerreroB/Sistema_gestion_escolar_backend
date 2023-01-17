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

  @OneToOne(() => Employees)
  @JoinColumn()
  employe: Employees;
}
