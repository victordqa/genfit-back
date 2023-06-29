import { Test, TestingModule } from '@nestjs/testing';
import { TrainningsController } from './trainnings.controller';

describe('TrainningsController', () => {
  let controller: TrainningsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainningsController],
    }).compile();

    controller = module.get<TrainningsController>(TrainningsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
