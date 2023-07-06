import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Trainning } from './Trainning';
import { TrainningBlockExercise } from './TrainningBlockExercise';
import { Block } from './Block';

@Entity()
export class TrainningBlock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('integer')
  duration_in_m: number;

  @ManyToOne(() => Trainning, (trainning) => trainning.trainningBlocks)
  trainning: Trainning;

  @Column()
  blockId: number;

  @OneToMany(
    () => TrainningBlockExercise,
    (trainningBlockExercise) => trainningBlockExercise.trainningBlock,
  )
  trainningBlockExercises: TrainningBlockExercise[];

  @ManyToOne(() => Block, (block) => block.trainningBlocks)
  block: Block;
}
