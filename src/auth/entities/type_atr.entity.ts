import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Administrators from './administrator.entity';
import Employees from './employe.entity';
import Jobs from './job.entity';
import Users from './user.entity';

@Entity({ name: 'types_users' })
export class TypesUsers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 15, unique: true })
  type_user: string;

  @OneToMany(() => Users, (user) => user.type_user)
  users: Users[];
}

@Entity({ name: 'types_employees' })
export class TypesEmployees {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 15, unique: true })
  type_employe: string;

  @OneToMany(() => Employees, (employe) => employe.type_employe)
  employees: Employees[];
}

@Entity({ name: 'types_jobs' })
export class TypesJobs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 15, unique: true })
  type_job: string;

  @OneToMany(() => Jobs, (job) => job.type_job)
  jobs: Jobs[];
}

@Entity({ name: 'types_administrators' })
export class TypesAdministrators {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 15, unique: true })
  type_administrator: string;

  @OneToMany(() => Administrators, (admin) => admin.type_administrator)
  administrators: Administrators[];
}
