import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Coach } from './Coach';

@Entity()
export class Exercise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column('decimal', { precision: 6, scale: 1 })
  time_per_rep_s: number;

  @Column()
  complexity: number;

  @Column()
  loadable: boolean;

  @Column()
  is_cardio_specific: boolean;

  @ManyToOne(() => Coach, (coach) => coach.exercises)
  coach: Coach;
}
