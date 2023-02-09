import Students from 'src/auth/entities/student.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EvaluationsStudents } from './evaluation.entity';
import GradesAndGroups from './grade_and_group.entity';

@Entity({ name: 'semesters' })
export class Semesters {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 15, unique: true })
  semester: string;

  @OneToMany(() => GradesAndGroups, (gag) => gag.semester)
  grades_and_groups: GradesAndGroups[];
}

@Entity({ name: 'semesters_evaluations' })
export class SemestersEvaluations {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('bool')
  has_excellence: boolean;

  @ManyToOne(
    () => EvaluationsStudents,
    (evalstdnt) => evalstdnt.semesters_Evaluations,
    {
      onDelete: 'CASCADE',
    },
  )
  evaluation_student: EvaluationsStudents;
}

@Entity({ name: 'semesters_averages' })
export default class SemestersAverages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  average: number;

  @Column('bool')
  has_excellence: boolean;

  @ManyToOne(() => GradesAndGroups, (gag) => gag.semesters_averages, {
    onDelete: 'CASCADE',
  })
  grade_and_group: GradesAndGroups;

  @ManyToOne(() => Students, (student) => student.semesters_averages, {
    onDelete: 'CASCADE',
  })
  student: Students;
}
