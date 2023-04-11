import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coach } from 'src/typeOrm/entities/Coach';
import { CreateCoachParams } from 'src/utils/types/types';
import { Repository } from 'typeorm';

@Injectable()
export class CoachesService {
  constructor(
    @InjectRepository(Coach) private coachRepository: Repository<Coach>,
  ) {}

  createCoach(coachDetails: CreateCoachParams) {
    const newCoach = this.coachRepository.create({
      ...coachDetails,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return this.coachRepository.save(newCoach);
  }
}
