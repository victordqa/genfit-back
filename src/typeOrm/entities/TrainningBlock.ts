import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Trainning } from './Trainning';

@Entity()
export class TrainningBlock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('integer')
  duration_in_m: number;

  @ManyToOne(() => Trainning, (trainning) => trainning.trainningBlocks)
  trainning: Trainning;
}
