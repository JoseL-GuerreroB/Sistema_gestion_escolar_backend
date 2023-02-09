import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Classes from './class_g.entity';
import ClassHours from './class_hour.entity';
import { PartialsEvaluations } from './evaluation.entity';

@Entity({ name: 'class_shifts' })
export class ClassShifts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 15, unique: true })
  class_shift: string;

  @OneToMany(() => ClassHours, (classhour) => classhour.class_shift)
  class_hours: ClassHours[];
}

@Entity({ name: 'technical_careers' })
export class TechnicalCareers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 15, unique: true })
  technical_career: string;

  @OneToMany(() => Classes, (classe) => classe.technical_career)
  classes: Classes[];
}

@Entity({ name: 'partials' })
export class Partials {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 15, unique: true })
  partial: string;

  @OneToMany(() => PartialsEvaluations, (partialeval) => partialeval.partial)
  partials_evaluations: PartialsEvaluations[];
}
