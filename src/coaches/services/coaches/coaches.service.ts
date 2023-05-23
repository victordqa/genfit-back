import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExercisesService } from 'src/exercises/services/exercises/exercises.service';
import { Box } from 'src/typeOrm/entities/Box';
import { Coach } from 'src/typeOrm/entities/Coach';
import { hashPassword } from 'src/utils/hashing';
import { CreateBoxParams, CreateCoachParams } from 'src/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class CoachesService {
  constructor(
    @InjectRepository(Coach) private coachRepository: Repository<Coach>,
    @InjectRepository(Box) private boxRepository: Repository<Box>,
    private exercisesService: ExercisesService,
  ) {}

  async createCoach(coachDetails: CreateCoachParams) {
    const { password, confirmPassword, email, name } = coachDetails;
    const dbCoach = await this.coachRepository.findOne({ where: { email } });
    if (dbCoach)
      throw new HttpException(
        'email already in use',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    if (password !== confirmPassword)
      throw new HttpException(
        'Password and confirmation password must match',
        HttpStatus.BAD_REQUEST,
      );

    const hashedPassword = await hashPassword(password);
    const newCoach = this.coachRepository.create({
      email,
      name,
      password: hashedPassword,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const savedCoach = this.coachRepository.save(newCoach);

    // also save default seed exercises
    this.exercisesService.seedExercises(newCoach);

    return savedCoach;
  }

  async createBox(boxDetails: CreateBoxParams) {
    const { coachId } = boxDetails;
    const coach = await this.coachRepository.findOneBy({ id: coachId });
    if (!coach)
      throw new HttpException(
        'User not found, can`t create Box',
        HttpStatus.BAD_REQUEST,
      );
    const newBox = this.boxRepository.create({
      ...boxDetails,
      coach,
    });

    return this.boxRepository.save(newBox);
  }

  findCoachByEmail(email: string) {
    return this.coachRepository.findOne({ where: { email } });
  }
}
