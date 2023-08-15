import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CoachesService } from '../../../coaches/services/coaches/coaches.service';
import { JwtService } from '@nestjs/jwt';
import * as hashingUtils from 'src/utils/hashing';

describe('AuthService', () => {
  let service: AuthService;
  let coachesService: CoachesService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: CoachesService,
          useValue: {
            findCoachByEmail: jest.fn(() => ({
              id: 1,
              name: 'John',
              email: 'j@gmail.com',
              password: '123456',
            })),
          },
        },
        {
          provide: JwtService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    coachesService = module.get<CoachesService>(CoachesService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    console.log(service);
    expect(service).toBeDefined();
  });

  it('coachesService should be defined', () => {
    expect(coachesService).toBeDefined();
  });

  it('jwtService should be defined', () => {
    expect(jwtService).toBeDefined();
  });

  describe('validateCoach', () => {
    it('should throw unauthorized error if email is not found', async () => {
      jest
        .spyOn(coachesService, 'findCoachByEmail')
        .mockReturnValueOnce(new Promise((resolve) => resolve(null)));

      await expect(async () => {
        await service.validateCoach('unexisting email', 'some password');
      }).rejects.toThrow('Email ou senha invalidos');
    });

    it('should throw unauthorized error if password does not match', async () => {
      jest
        .spyOn(hashingUtils, 'compareHashes')
        .mockReturnValueOnce(new Promise((resolve) => resolve(false)));

      await expect(async () => {
        await service.validateCoach('j@gmail.com', 'some password');
      }).rejects.toThrow('Email ou senha invalidos');
    });
  });
});
