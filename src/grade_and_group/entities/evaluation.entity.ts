import Students from 'src/auth/entities/student.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Classes from './class_g.entity';
import { Partials } from './help_class.entity';
import { SemestersEvaluations } from './semester.entity';

@Entity({ name: 'evaluations_students' })
export class EvaluationsStudents {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  qualification: number;

  @ManyToOne(
    () => StatusEvaluations,
    (sttseval) => sttseval.evaluations_students,
    {
      onDelete: 'SET NULL',
    },
  )
  status_evaluation: StatusEvaluations;

  @ManyToOne(() => Students, (student) => student.evaluations_students, {
    onDelete: 'CASCADE',
  })
  student: Students;

  @ManyToOne(() => Classes, (classe) => classe.evaluations_students, {
    onDelete: 'CASCADE',
  })
  class_g: Classes;

  @OneToMany(
    () => PartialsEvaluations,
    (partialeval) => partialeval.evaluation_student,
  )
  parcials_evaluations: PartialsEvaluations[];

  @OneToMany(
    () => SemestersEvaluations,
    (semestereval) => semestereval.evaluation_student,
  )
  semesters_Evaluations: SemestersEvaluations[];
}

@Entity({ name: 'partials_evaluations' })
export class PartialsEvaluations {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => EvaluationsStudents,
    (evalstdnt) => evalstdnt.parcials_evaluations,
    {
      onDelete: 'CASCADE',
    },
  )
  evaluation_student: EvaluationsStudents;

  @ManyToOne(() => Partials, (partial) => partial.partials_evaluations, {
    onDelete: 'SET NULL',
  })
  partial: Partials;
}

@Entity({ name: 'status_evaluations' })
export class StatusEvaluations {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 15, unique: true })
  status_evaluation: string;

  @OneToMany(
    () => EvaluationsStudents,
    (evalstdnt) => evalstdnt.status_evaluation,
  )
  evaluations_students: EvaluationsStudents[];
}
