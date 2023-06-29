import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Coach Controller (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('POST - coaches/create', () => {
    it('should create a new coach', () => {
      return request(app.getHttpServer())
        .post('/coaches/create')
        .send({
          name: 'Victor',
          email: 'v@gmail.com',
          password: '123456',
          confirmPassword: '123456',
        })
        .expect(201);
    });

    it('should fail to create a user with a taken email', () => {
      return request(app.getHttpServer())
        .post('/coaches/create')
        .send({
          name: 'Victor',
          email: 'v@gmail.com',
          password: '123456',
          confirmPassword: '123456',
        })
        .expect(422);
    });
  });
  afterAll(async () => {
    await app.close();
  });
});
