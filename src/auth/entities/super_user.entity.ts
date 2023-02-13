import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Users from './user.entity';

@Entity({ name: 'super_users' })
export default class SuperUsers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 50 })
  high_level_title: string;

  @OneToOne(() => Users)
  @JoinColumn()
  user: Users;
}
