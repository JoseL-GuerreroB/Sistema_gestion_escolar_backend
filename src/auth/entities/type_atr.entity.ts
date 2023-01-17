import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Employees from './employe.entity';
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
