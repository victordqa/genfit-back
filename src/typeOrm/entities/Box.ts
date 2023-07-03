import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Coach } from './Coach';
import { Trainning } from './Trainning';

@Entity()
export class Box {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: String;

  @ManyToOne(() => Coach, (coach) => coach.boxes)
  coach: Coach;
  @OneToMany(() => Trainning, (trainning) => trainning.box)
  trainnings: Trainning[];

  @Column()
  coachId: number;
}
