import { EvaluationsStudents } from 'src/grade_and_group/entities/evaluation.entity';
import GradesAndGroups from 'src/grade_and_group/entities/grade_and_group.entity';
import SemestersAverages from 'src/grade_and_group/entities/semester.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  OneToMany,
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

  @ManyToOne(
    () => StatusStudents,
    (statusstundent) => statusstundent.students,
    {
      onDelete: 'SET NULL',
    },
  )
  status_student: StatusStudents;

  @ManyToOne(() => GradesAndGroups, (gag) => gag.students)
  grade_and_group: GradesAndGroups;

  @OneToOne(() => Users)
  @JoinColumn()
  user: Users;

  @OneToMany(() => EvaluationsStudents, (evalstdnt) => evalstdnt.student)
  evaluations_students: EvaluationsStudents[];

  @OneToMany(() => SemestersAverages, (semesteravg) => semesteravg.student)
  semesters_averages: SemestersAverages[];
}
