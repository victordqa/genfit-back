import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TrainningBlock } from './TrainningBlock';

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

  @OneToMany(() => TrainningBlock, (trainningBlock) => trainningBlock.block)
  trainningBlocks: TrainningBlock[];
}
