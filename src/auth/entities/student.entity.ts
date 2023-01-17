import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { StatusStudents } from './status_atr.entity';
import Users from './user.entity';

@Entity({ name: 'students' })
export default class Students {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 30 })
  tutor: string;

  @Column('varchar', { length: 10 })
  tutor_phone: string;

  @ManyToOne(() => StatusStudents, (statusstundent) => statusstundent.students)
  status_student: StatusStudents;

  @OneToOne(() => Users)
  @JoinColumn()
  user: Users;
}
