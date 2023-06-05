import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Coach } from './Coach';
import { ExerciseMuscleImpact } from './ExerciseMuscleImpact';

@Entity()
export class Muscle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  ref_week_load: number;

  @OneToMany(() => Coach, (coach) => coach.exercises)
  coach: Coach;

  @OneToMany(
    () => ExerciseMuscleImpact,
    (exercise_muscle_impact) => exercise_muscle_impact.muscle,
  )
  exercise_muscle_impact: ExerciseMuscleImpact[];
}
