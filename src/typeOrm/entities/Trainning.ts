import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TrainningBlock } from './TrainningBlock';
import { Box } from './Box';

@Entity()
export class Trainning {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date; // Creation date

  @UpdateDateColumn()
  updated_at: Date; // Last updated date

  @OneToMany(() => TrainningBlock, (trainningBlock) => trainningBlock.trainning)
  trainningBlocks: TrainningBlock[];
  @ManyToOne(() => Box, (box) => box.trainnings)
  box: Box;

  @Column()
  boxId: number;
}
