import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../../services/auth/auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Coach } from '../../../typeOrm/entities/Coach';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  let reqMock = {
    user: { id: 1, name: 'John', email: 'john@gmail.com', password: 123456 },
  } as unknown as Request;
  let resMock = { send: jest.fn(), cookie: jest.fn() } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: 'AUTH_SERVICE',
          useValue: {
            login: jest.fn(() => ({
              access_token: 'some token',
            })),
          },
        },
        { provide: ConfigService, useValue: { get: jest.fn(() => '300s') } },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>('AUTH_SERVICE');
  });

  it(' controller should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('login', () => {
    it('should call auth service to generate a jwt', async () => {
      await controller.login(reqMock, resMock);
      expect(authService.login).toHaveBeenCalledWith(reqMock.user);
    });

    it('should  setup jwt cookie', async () => {
      await controller.login(reqMock, resMock);
      expect(resMock.cookie).toHaveBeenCalledWith(
        'accessToken',
        { access_token: 'some token' },
        expect.anything(),
      );
    });
  });
});
