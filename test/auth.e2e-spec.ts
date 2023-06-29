import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  const coachDataMock = {
    name: 'auth',
    email: 'v@gmail.com',
    password: '123456',
    confirmPassword: '123456',
  };
  let tokenMock: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    //create a user
    await request(app.getHttpServer())
      .post('/coaches/create')
      .send(coachDataMock);
  });

  describe('POST - auth/login', () => {
    it('should let a registred user login returning a jwt', async () => {
      let res = await request(app.getHttpServer()).post('/auth/login').send({
        email: coachDataMock.email,
        password: coachDataMock.password,
      });
      expect(res.statusCode).toBe(201);
      expect(res.body.access_token).toBeTruthy();
      tokenMock = res.body.access_token;
    });

    it('should not let a unregistred user consume prive routes', async () => {
      let res = await request(app.getHttpServer())
        .post('/coaches/create-box')
        .send({
          name: 'some box name',
          password: coachDataMock.password,
        });
      expect(res.statusCode).toBe(401);
    });
  });
  afterAll(async () => {
    await app.close();
  });
});
