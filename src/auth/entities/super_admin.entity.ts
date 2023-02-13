import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Employees from './employe.entity';

@Entity({ name: 'super_administrators' })
export default class SuperAdministrators {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { width: 1, unique: true })
  position: number;

  @OneToOne(() => Employees)
  @JoinColumn()
  employe: Employees;
}
