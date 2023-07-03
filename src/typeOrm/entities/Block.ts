import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Box } from './Box';
import { Exercise } from './Exercise';

@Entity()
export class Block {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column('integer')
  min_duration_in_m: number;
  @Column('integer')
  max_duration_in_m: number;

  @OneToMany(() => Box, (box) => box.coach)
  boxes: Box[];

  @OneToMany(() => Exercise, (exercise) => exercise.coach)
  exercises: Exercise[];
}
