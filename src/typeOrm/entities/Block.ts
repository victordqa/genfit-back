import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TrainningBlock } from './TrainningBlock';
import { Modifier } from './Modifier';

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

  @ManyToMany(() => Modifier, (modifier) => modifier.blocks)
  modifiers: Modifier[];
}
