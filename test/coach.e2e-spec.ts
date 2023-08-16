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
    it('should create a new coach if provided data is valid', () => {
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

    it('should fail to create a user if passwords do not match', async () => {
      const res = await request(app.getHttpServer())
        .post('/coaches/create')
        .send({
          name: 'Victor',
          email: 'v2@gmail.com',
          password: '123456',
          confirmPassword: '654321',
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(
        'Password and confirmation password must match',
      );
    });

    it('should fail to create a user if email is invalid', async () => {
      const res = await request(app.getHttpServer())
        .post('/coaches/create')
        .send({
          name: 'Victor',
          email: 'notanemail',
          password: '123456',
          confirmPassword: '123456',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message[0]).toMatch('email must be an email');
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
