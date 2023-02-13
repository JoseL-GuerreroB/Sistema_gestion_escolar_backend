import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import Users from './user.entity';

@Entity()
export class Roles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 50, unique: true })
  role: string;

  @ManyToMany(() => Users, (user) => user.roles)
  users: Users[];
}
