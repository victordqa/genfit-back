import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ExercisesService } from '../../../../src/exercises/services/exercises/exercises.service';
import { Box } from '../../../../src/typeOrm/entities/Box';
import { Coach } from '../../../../src/typeOrm/entities/Coach';
import { hashPassword } from '../../../../src/utils/hashing';
import {
  CreateCoachParams,
  CreateBoxParams,
} from '../../../../src/utils/types';

@Injectable()
export class CoachesFixtureService {
  constructor(
    @InjectRepository(Coach) private coachRepository: Repository<Coach>,
    @InjectRepository(Box) private boxRepository: Repository<Box>,
    private exercisesService: ExercisesService,
    private dataSource: DataSource,
  ) {}

  async createCoach(coachDetails: CreateCoachParams) {
    const { password, email, name } = coachDetails;

    const hashedPassword = await hashPassword(password);
    const newCoach = this.coachRepository.create({
      email,
      name,
      password: hashedPassword,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const savedCoach = await this.coachRepository.save(newCoach);
    return savedCoach;
  }

  //   async createBox(boxDetails: CreateBoxParams) {
  //     const { coachId } = boxDetails;
  //     const coach = await this.coachRepository.findOneBy({ id: coachId });

  //     const newBox = this.boxRepository.create({
  //       ...boxDetails,
  //       coach,
  //     });

  //     return this.boxRepository.save(newBox);
  //   }

  //   async listCoachBoxes(coachId: number) {
  //     const boxes = await this.boxRepository.find({
  //       where: { coachId },
  //       relations: { trainnings: true },
  //     });
  //     return boxes;
  //   }

  //   async findCoachById(coachId: number) {
  //     const { password, ...rest } = await this.coachRepository.findOne({
  //       where: { id: coachId },
  //     });
  //     return rest;
  //   }

  //   findCoachByEmail(email: string) {
  //     return this.coachRepository.findOne({ where: { email } });
  //   }
}
