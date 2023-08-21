import { Repository } from 'typeorm';
import { Coach } from '../../../src/typeOrm/entities/Coach';
import { CreateCoachParams } from '../../../src/utils/types';
import { hashPassword } from '../../../src/utils/hashing';

const coachFixture = {
  async createCoach(
    coachRepo: Repository<Coach>,
    createCoachParams: CreateCoachParams,
  ) {
    const { name, email, password } = createCoachParams;
    const hashedPassword = await hashPassword(password);
    const newCoach = coachRepo.create({
      email,
      name,
      password: hashedPassword,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const savedCoach = await coachRepo.save(newCoach);
    return savedCoach;
  },
};

export default coachFixture;
