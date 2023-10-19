import { Test, TestingModule } from '@nestjs/testing';
import { ExercisesController } from './exercises.controller';
import { ExercisesService } from '../../services/exercises/exercises.service';

describe('ExercisesController', () => {
  let controller: ExercisesController;
  let exercisesService: ExercisesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExercisesController],
      providers: [
        {
          provide: ExercisesService,
          useValue: { listExercisesFiltered: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<ExercisesController>(ExercisesController);
    exercisesService = module.get(ExercisesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('list-filtered', () => {
    const queryMock = {
      search: 'some search string',
      take: 10,
      skip: 2,
    };
    const userPayloadMock = { sub: 1, email: 'somemail@gmail.com' };
    it('should call listExercisesFiltered with correct params', async () => {
      await controller.listFilteredExercisesAndPreloads(
        queryMock,
        userPayloadMock,
      );
      expect(exercisesService.listExercisesFiltered).toHaveBeenCalledWith(
        queryMock,
        userPayloadMock.sub,
      );
    });
  });
});
