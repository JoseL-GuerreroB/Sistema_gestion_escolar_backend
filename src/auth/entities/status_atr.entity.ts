import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Employees from './employe.entity';
import Students from './student.entity';

@Entity({ name: 'status_students' })
export class StatusStudents {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 15, unique: true })
  status_student: string;

  @OneToMany(() => Students, (student) => student.status_student)
  students: Students[];
}

@Entity({ name: 'status_employees' })
export class StatusEmployees {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 15, unique: true })
  status_employe: string;

  @OneToMany(() => Employees, (employe) => employe.status_employe)
  employees: Employees[];
}
