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

  @ManyToMany(() => Block)
  @JoinTable()
  blocks: Block[];
}
