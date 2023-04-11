import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Coach } from './Coach';

@Entity()
export class Box {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: String;

  @Column()
  password: string;

  @ManyToOne(() => Coach, (coach) => coach.boxes)
  coach: Coach;
}
