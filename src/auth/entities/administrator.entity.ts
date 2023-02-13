import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Employees from './employe.entity';
import { TypesAdministrators } from './type_atr.entity';

@Entity({ name: 'administrators' })
export default class Administrators {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 15 })
  area: string;

  @ManyToOne(() => TypesAdministrators, (typeadmin) => typeadmin.administrators)
  type_administrator: TypesAdministrators;

  @OneToOne(() => Employees)
  @JoinColumn()
  employe: Employees;
}
