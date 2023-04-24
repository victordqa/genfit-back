import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
  ) {}

  async createCoach(coachDetails: CreateCoachParams) {
    const { password, confirmPassword, email, name } = coachDetails;
    const dbCoach = await this.findCoachByEmail(email);
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

    return this.coachRepository.save(newCoach);
  }

  async createBox(boxDetails: CreateBoxParams) {
    const coachId = boxDetails.coachId;

    const coach = await this.coachRepository.findOneBy({ id: coachId });
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
