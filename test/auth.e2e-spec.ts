import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as cookieParser from 'cookie-parser';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  const coachDataMock = {
    name: 'auth',
    email: 'v@gmail.com',
    password: '123456',
    confirmPassword: '123456',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
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
    });

    it('should not let a unregistered user consume private routes', async () => {
      let res = await request(app.getHttpServer())
        .post('/coaches/create-box')
        .send({
          name: 'some box name',
          password: coachDataMock.password,
        });
      expect(res.statusCode).toBe(401);
    });

    it('should let a registered user consume private routes', async () => {
      //login user

      let loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: coachDataMock.email,
          password: coachDataMock.password,
        });

      const token_value = loginRes.body.accessToken;

      let res = await request(app.getHttpServer())
        .post('/coaches/create-box')
        .set('Cookie', [`accessToken=${token_value}`])
        .send({
          name: 'some box name',
          password: coachDataMock.password,
        });
      expect(res.statusCode).toBe(201);
    });
  });

  describe('POST - auth/logout', () => {
    it('should send instructions for the user agent to clear the token', async () => {
      //login user

      await request(app.getHttpServer()).post('/auth/login').send({
        email: coachDataMock.email,
        password: coachDataMock.password,
      });

      let res = await request(app.getHttpServer()).get('/auth/logout');
      expect(res.statusCode).toBe(200);
      expect(res.headers['set-cookie'][0]).toMatch('accessToken=none');
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
