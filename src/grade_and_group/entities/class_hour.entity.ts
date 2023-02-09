import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Classes from './class_g.entity';
import { ClassShifts } from './help_class.entity';

@Entity({ name: 'class_hours' })
export default class ClassHours {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('time')
  start_time: string;

  @Column('time')
  end_time: string;

  @OneToMany(() => Classes, (classe) => classe.class_hour)
  classes: Classes[];

  @ManyToOne(() => ClassShifts, (classshift) => classshift.class_hours, {
    onDelete: 'SET NULL',
  })
  class_shift: ClassShifts;
}
