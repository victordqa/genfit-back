import { Test, TestingModule } from '@nestjs/testing';
import { TrainningsService } from './trainnings.service';

describe('TrainningsService', () => {
  let service: TrainningsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrainningsService],
    }).compile();

    service = module.get<TrainningsService>(TrainningsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
