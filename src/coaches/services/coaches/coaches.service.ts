import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Box } from 'src/typeOrm/entities/Box';
import { Coach } from 'src/typeOrm/entities/Coach';
import { CreateBoxParams, CreateCoachParams } from 'src/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class CoachesService {
  constructor(
    @InjectRepository(Coach) private coachRepository: Repository<Coach>,
    @InjectRepository(Box) private boxRepository: Repository<Box>,
  ) {}

  createCoach(coachDetails: CreateCoachParams) {
    const newCoach = this.coachRepository.create({
      ...coachDetails,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return this.coachRepository.save(newCoach);
  }

  async createBox(boxDetails: CreateBoxParams) {
    const coachId = boxDetails.coachId;
    console.log('++++++++++++++++++++++++');
    console.log(boxDetails);

    console.log('coachId ', coachId);
    const coach = await this.coachRepository.findOneBy({ id: 87878 });
    console.log(coach);
    if (!coach)
      throw new HttpException(
        'User not found, can`t create Box',
        HttpStatus.BAD_REQUEST,
      );
    const newBox = this.boxRepository.create({
      ...boxDetails,
    });

    return this.boxRepository.save(newBox);
  }

  findCoachByEmail(email: string) {
    return this.coachRepository.findOne({ where: { email } });
  }
}
