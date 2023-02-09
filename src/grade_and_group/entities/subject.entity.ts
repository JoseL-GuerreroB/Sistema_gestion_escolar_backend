import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Classes from './class_g.entity';

@Entity({ name: 'subjects' })
export default class Subjects {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 30 })
  subject: string;

  @Column('varchar', { length: 50 })
  implementation: string;

  @Column('varchar', { length: 15, nullable: true })
  difficulty: string;

  @OneToMany(() => Classes, (classe) => classe.subject, {
    onDelete: 'SET NULL',
  })
  classes: Classes;
}
