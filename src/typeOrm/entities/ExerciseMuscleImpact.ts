import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Muscle } from './Muscle';
import { Exercise } from './Exercise';

@Entity()
export class ExerciseMuscleImpact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  exerciseId: number;

  @Column()
  muscleId: number;

  @Column()
  impact: number;

  @ManyToOne(() => Exercise, (exercise) => exercise.exercise_muscle_impact)
  exercise: Exercise;

  @ManyToOne(() => Muscle, (muscle) => muscle.exercise_muscle_impact)
  muscle: Muscle;
}
