import Students from 'src/auth/entities/student.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Classes from './class_g.entity';
import SemestersAverages, { Semesters } from './semester.entity';

@Entity({ name: 'grades_and_groups' })
export default class GradesAndGroups {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { width: 2 })
  grade: number;

  @Column('varchar', { length: 1 })
  group: string;

  @Column('varchar', { length: 4 })
  generation: string;

  @Column('varchar', { length: 15 })
  school_cycle: string;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  create_at: Date;

  @ManyToOne(() => Semesters, (semester) => semester.grades_and_groups, {
    onDelete: 'SET NULL',
  })
  semester: Semesters;

  @OneToMany(() => Students, (student) => student.grade_and_group)
  students: Students[];

  @OneToMany(() => Classes, (classe) => classe.grade_and_group)
  classes: Classes[];

  @OneToMany(
    () => SemestersAverages,
    (semesteravg) => semesteravg.grade_and_group,
  )
  semesters_averages: SemestersAverages[];
}
