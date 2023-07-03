import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Muscle } from './Muscle';
import { Exercise } from './Exercise';
import { TrainningBlock } from './TrainningBlock';

@Entity()
export class TrainningBlockExercise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  exerciseId: number;

  @Column()
  trainningBlockId: number;

  @Column('integer')
  reps: number;

  @Column('float')
  load: number;

  @Index()
  @ManyToOne(() => Exercise, (exercise) => exercise.trainningBlockExercises)
  exercise: Exercise;

  @ManyToOne(
    () => TrainningBlock,
    (trainningBlock) => trainningBlock.trainningBlockExercises,
  )
  trainningBlock: TrainningBlock;
}
