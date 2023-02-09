import Teachers from 'src/auth/entities/teacher.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import ClassHours from './class_hour.entity';
import { EvaluationsStudents } from './evaluation.entity';
import GradesAndGroups from './grade_and_group.entity';
import { TechnicalCareers } from './help_class.entity';
import Subjects from './subject.entity';

@Entity({ name: 'classes' })
export default class Classes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 4 })
  classroom: string;

  @ManyToOne(() => Teachers, (teacher) => teacher.classes, {
    onDelete: 'SET NULL',
  })
  teacher: Teachers;

  @ManyToOne(() => Subjects, (subject) => subject.classes, {
    onDelete: 'SET NULL',
  })
  subject: Subjects;

  @ManyToOne(() => ClassHours, (classhour) => classhour.classes, {
    onDelete: 'SET NULL',
  })
  class_hour: ClassHours;

  @ManyToOne(() => GradesAndGroups, (gag) => gag.classes, {
    onDelete: 'SET NULL',
  })
  grade_and_group: GradesAndGroups;

  @ManyToOne(() => TechnicalCareers, (tc) => tc.classes, {
    onDelete: 'SET NULL',
  })
  technical_career: TechnicalCareers;

  @OneToMany(() => EvaluationsStudents, (evalstdnt) => evalstdnt.class_g)
  evaluations_students: EvaluationsStudents[];
}
