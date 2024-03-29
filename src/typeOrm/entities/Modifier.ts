import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Block } from './Block';
import { TrainningBlock } from './TrainningBlock';

@Entity()
export class Modifier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column('integer')
  min_candidates: number;

  @Column('integer')
  max_candidates: number;

  @ManyToMany(() => Block, (block) => block.modifiers)
  @JoinTable()
  blocks: Block[];

  @OneToMany(() => TrainningBlock, (trainningBlock) => trainningBlock.modifier)
  trainningBlocks: TrainningBlock[];
}
