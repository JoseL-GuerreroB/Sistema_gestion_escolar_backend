import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Roles } from './authorization.entity';
import { TypesUsers } from './type_atr.entity';

@Entity({ name: 'users' })
export default class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('blob', { nullable: true })
  photo: string;

  @Column('varchar', { length: 20, unique: true })
  username: string;

  @Column('varchar', { length: 30 })
  first_name: string;

  @Column('varchar', { length: 30 })
  last_name: string;

  @Column('date')
  date_of_birth: string;

  @Column('int', { width: 3 })
  age: number;

  @Column('varchar', { length: 100 })
  address: string;

  @Column('enum', {
    enum: ['No especificado', 'Masculino', 'Femenino'],
    default: 'No especificado',
  })
  gender: string;

  @Column('varchar', { length: 20 })
  nationality: string;

  @Column('varchar', { length: 10, nullable: true })
  phone: string;

  @Column('varchar', { length: 255, unique: true })
  email: string;

  @Column('varchar')
  password: string;

  @ManyToOne(() => TypesUsers, (typeuser) => typeuser.users, {
    onDelete: 'SET NULL',
  })
  type_user: TypesUsers;

  @ManyToMany(() => Roles, (role) => role.users)
  @JoinTable({
    name: 'users_roles',
    joinColumn: {
      name: 'userId',
    },
    inverseJoinColumn: {
      name: 'roleId',
    },
  })
  roles: Roles[];
}
