import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Coach } from './Coach';
import { ExerciseMuscleImpact } from './ExerciseMuscleImpact';
import { TrainningBlockExercise } from './TrainningBlockExercise';
import { Block } from './Block';

@Entity()
export class Exercise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 6, scale: 1 })
  time_per_rep_s: number;

  @Column()
  complexity: number;

  @Column()
  loadable: boolean;

  @Column()
  is_cardio_specific: boolean;

  @Index()
  @ManyToOne(() => Coach, (coach) => coach.exercises)
  coach: Coach;
  @OneToMany(
    () => ExerciseMuscleImpact,
    (exercise_muscle_impact) => exercise_muscle_impact.exercise,
  )
  exercise_muscle_impact: ExerciseMuscleImpact[];

  @OneToMany(
    () => TrainningBlockExercise,
    (trainningBlockExercise) => trainningBlockExercise.exercise,
  )
  trainningBlockExercises: TrainningBlockExercise[];

  @ManyToMany(() => Block)
  @JoinTable()
  blocks: Block[];
}
