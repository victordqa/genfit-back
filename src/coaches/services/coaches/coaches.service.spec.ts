import { Test, TestingModule } from '@nestjs/testing';
import { CoachesService } from './coaches.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Coach } from 'src/typeOrm/entities/Coach';
import { Box } from 'src/typeOrm/entities/Box';
import { Repository } from 'typeorm';
import * as hashingUtils from 'src/utils/hashing';

describe('CoachesService', () => {
  let service: CoachesService;
  let coachRepository: Repository<Coach>;
  let boxRepository: Repository<Box>;

  const COACH_TOKEN = getRepositoryToken(Coach);
  const BOX_TOKEN = getRepositoryToken(Box);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoachesService,
        {
          provide: COACH_TOKEN,
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Box),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CoachesService>(CoachesService);
    coachRepository = module.get<Repository<Coach>>(COACH_TOKEN);
    boxRepository = module.get<Repository<Box>>(BOX_TOKEN);
  });

  describe('CoachService tests', () => {
    it('deps should be defined', () => {
      expect(service).toBeDefined();
      expect(coachRepository).toBeDefined();
      expect(boxRepository).toBeDefined();
    });

    describe('createCoach method', () => {
      const strgPromise: Promise<string> = new Promise((resolve) =>
        resolve('hashed123456'),
      );
      jest.spyOn(hashingUtils, 'hashPassword').mockReturnValue(strgPromise);

      it('should hash password', async () => {
        const coach = await service.createCoach({
          name: 'Victor',
          email: 'v@gmail.com',
          password: '123456',
          confirmPassword: '123456',
        });
        expect(hashingUtils.hashPassword).toHaveBeenCalledWith('123456');
      });
    });
  });
});
