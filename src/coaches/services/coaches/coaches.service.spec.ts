import { Test, TestingModule } from '@nestjs/testing';
import { CoachesService } from './coaches.service';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { Coach } from 'src/typeOrm/entities/Coach';
import { Box } from 'src/typeOrm/entities/Box';
import { DataSource, Repository } from 'typeorm';
import * as hashingUtils from 'src/utils/hashing';
import { ExercisesService } from 'src/exercises/services/exercises/exercises.service';

describe('CoachesService', () => {
  let service: CoachesService;
  let coachRepository: Repository<Coach>;
  let boxRepository: Repository<Box>;
  let exercisesService: ExercisesService;
  let dataSource: DataSource;

  const COACH_TOKEN = getRepositoryToken(Coach);
  const BOX_TOKEN = getRepositoryToken(Box);
  const DATA_SOURCE_TOKEN = getDataSourceToken();

  const connectMock = jest.fn();
  const startTransactionMock = jest.fn();
  const saveTransactionMock = jest.fn();
  const commitTransactionMock = jest.fn();
  const releaseMock = jest.fn();
  const rollbackTransactionMock = jest.fn();

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
          provide: BOX_TOKEN,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: ExercisesService,
          useValue: {
            seedExercises: jest.fn((x) => [1, 2, 3]),
            seedExerciseMuscleImpact: jest.fn((x) => [1, 2, 3]),
          },
        },
        {
          provide: DATA_SOURCE_TOKEN,
          useValue: {
            createQueryRunner: jest.fn(() => ({
              connect: connectMock,
              startTransaction: startTransactionMock,
              manager: { save: saveTransactionMock },
              commitTransaction: commitTransactionMock,
              release: releaseMock,
              rollbackTransaction: rollbackTransactionMock,
            })),
          },
        },
      ],
    }).compile();

    service = module.get<CoachesService>(CoachesService);
    exercisesService = module.get<ExercisesService>(ExercisesService);
    coachRepository = module.get<Repository<Coach>>(COACH_TOKEN);
    boxRepository = module.get<Repository<Box>>(BOX_TOKEN);
    dataSource = module.get<DataSource>(DataSource);
  });

  const coachDataMock = {
    name: 'Victor',
    email: 'v@gmail.com',
    password: '123456',
    confirmPassword: '123456',
  };

  const promisedDbCoachMock: Promise<Coach> = new Promise((resolve) =>
    resolve({
      id: 1,
      created_at: new Date(),
      updated_at: new Date(),
      boxes: [],
      exercises: [],
      ...coachDataMock,
    }),
  );

  describe('CoachService tests', () => {
    it('deps should be defined', () => {
      expect(service).toBeDefined();
      expect(coachRepository).toBeDefined();
      expect(boxRepository).toBeDefined();
      expect(exercisesService).toBeDefined();
    });

    describe('createCoach method', () => {
      const strgPromise: Promise<string> = new Promise((resolve) =>
        resolve('hashed123456'),
      );
      jest.spyOn(hashingUtils, 'hashPassword').mockReturnValue(strgPromise);

      it('should hash password', async () => {
        jest.spyOn(coachRepository, 'create').mockReturnValueOnce({
          ...coachDataMock,
          id: 1,
          created_at: new Date(),
          updated_at: new Date(),
          boxes: [],
          exercises: [],
        });
        await service.createCoach(coachDataMock);
        expect(hashingUtils.hashPassword).toHaveBeenCalledWith('123456');
      });
      it(' should throw if email is taken', async () => {
        const promisedDbCoachMock: Promise<Coach> = new Promise((resolve) =>
          resolve({
            id: 1,
            created_at: new Date(),
            updated_at: new Date(),
            boxes: [],
            exercises: [],
            ...coachDataMock,
          }),
        );
        jest
          .spyOn(coachRepository, 'findOne')
          .mockReturnValueOnce(promisedDbCoachMock);

        try {
          await service.createCoach({
            name: 'Victor',
            email: 'v@gmail.com',
            password: '123456',
            confirmPassword: '123456',
          });
        } catch (error) {
          expect(error.message).toMatch('email already in use');
        }
      });

      it('should throw if passwords do not match', async () => {
        try {
          await service.createCoach({
            name: 'Victor',
            email: 'v@gmail.com',
            password: '123456',
            confirmPassword: 'not matching',
          });
        } catch (error) {
          expect(error.message).toMatch(
            'Password and confirmation password must match',
          );
        }
      });

      it(' should call on createCoach repo with correct info', async () => {
        await service.createCoach({
          name: 'Victor',
          email: 'v@gmail.com',
          password: '123456',
          confirmPassword: '123456',
        });
        expect(coachRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Victor',
            email: 'v@gmail.com',
            password: 'hashed123456',
          }),
        );
      });

      it('should call on query runner manager save method with correct params', async () => {
        await service.createCoach({
          name: 'Victor',
          email: 'v@gmail.com',
          password: '123456',
          confirmPassword: '123456',
        });
        expect(dataSource.createQueryRunner).toHaveBeenCalled();
        expect(connectMock).toHaveBeenCalled();
        expect(startTransactionMock).toHaveBeenCalled();
        expect(saveTransactionMock).toHaveBeenCalledWith(
          expect.objectContaining(coachDataMock),
        );
      });

      it('should rollback if any error occurs', async () => {
        jest
          .spyOn(dataSource.createQueryRunner().manager, 'save')
          .mockReturnValueOnce(
            new Promise((_res, _rej) => {
              throw new Error('error on saving transaction');
            }),
          );

        await expect(async () => {
          await service.createCoach({
            name: 'Victor',
            email: 'v@gmail.com',
            password: '123456',
            confirmPassword: '123456',
          });
        }).rejects.toThrow(
          'Error on user creation and default exercise seeding',
        );

        expect(dataSource.createQueryRunner).toHaveBeenCalled();
        expect(connectMock).toHaveBeenCalled();
        expect(startTransactionMock).toHaveBeenCalled();
        expect(saveTransactionMock).toHaveBeenCalledWith(
          expect.objectContaining(coachDataMock),
        );
        expect(rollbackTransactionMock).toHaveBeenCalled();
      });
    });
    describe('createBox', () => {
      it('should call create a box if coach is in database', async () => {
        jest
          .spyOn(coachRepository, 'findOneBy')
          .mockReturnValueOnce(promisedDbCoachMock);
        await service.createBox({ name: 'Victor', coachId: 1 });
        expect(coachRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
        expect(boxRepository.create).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Victor',
            coachId: 1,
          }),
        );
      });
    });
  });
});
