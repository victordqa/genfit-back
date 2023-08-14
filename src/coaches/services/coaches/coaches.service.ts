import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ExercisesService } from '../../../exercises/services/exercises/exercises.service';
import { Box } from '../../../typeOrm/entities/Box';
import { Coach } from '../../../typeOrm/entities/Coach';
import { hashPassword } from '../../../utils/hashing';
import { CreateCoachParams, CreateBoxParams } from '../../../utils/types';

@Injectable()
export class CoachesService {
  constructor(
    @InjectRepository(Coach) private coachRepository: Repository<Coach>,
    @InjectRepository(Box) private boxRepository: Repository<Box>,
    private exercisesService: ExercisesService,
    private dataSource: DataSource,
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

    const queryRunner = this.dataSource.createQueryRunner();

    //using transactions
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const savedCoach = await queryRunner.manager.save(newCoach);
      const exerciseMuscleSeeds = await this.exercisesService.seedExercises(
        newCoach,
      );

      const exerciseSeeds = exerciseMuscleSeeds.map(
        (seeds) => seeds.exerciseSeed,
      );

      const savedExercises = await queryRunner.manager.save(exerciseSeeds);
      const muscleImpacts = exerciseMuscleSeeds.map(
        (seed) => seed.musclesTargetWithIds,
      );

      const exerciseMuscleImpactsInstances =
        this.exercisesService.seedExerciseMuscleImpact(
          muscleImpacts,
          savedExercises,
        );

      await queryRunner.manager.save(exerciseMuscleImpactsInstances);
      await queryRunner.commitTransaction();
      return savedCoach;
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        'Error on user creation and default exercise seeding',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async createBox(boxDetails: CreateBoxParams) {
    const { coachId } = boxDetails;
    const coach = await this.coachRepository.findOneBy({ id: coachId });

    const newBox = this.boxRepository.create({
      ...boxDetails,
      coach,
    });

    return this.boxRepository.save(newBox);
  }

  async listCoachBoxes(coachId: number) {
    const boxes = await this.boxRepository.find({
      where: { coachId },
      relations: { trainnings: true },
    });
    return boxes;
  }

  async findCoachById(coachId: number) {
    const { password, ...rest } = await this.coachRepository.findOne({
      where: { id: coachId },
    });
    return rest;
  }

  findCoachByEmail(email: string) {
    return this.coachRepository.findOne({ where: { email } });
  }
}
