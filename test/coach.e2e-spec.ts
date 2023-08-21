import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Repository } from 'typeorm';
import { Coach } from '../src/typeOrm/entities/Coach';
import { hashPassword } from '../src/utils/hashing';
import coachFixture from './utils/fixtures/coachFixture';
import { JwtService } from '@nestjs/jwt';
import authFixture from './utils/fixtures/authFixture';
import resetDb from './utils/resetDb';
import { Exercise } from '../src/typeOrm/entities/Exercise';
import * as cookieParser from 'cookie-parser';

describe('Coach Controller (e2e)', () => {
  let app: INestApplication;
  let coachRepo: Repository<Coach>;
  let jwtService: JwtService;
  let exerciseRepo: Repository<Exercise>;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();

    coachRepo = moduleFixture.get('CoachRepository');
    exerciseRepo = moduleFixture.get('ExerciseRepository');
    jwtService = moduleFixture.get(JwtService);
  });

  beforeEach(async () => {
    await resetDb.reset();
  });

  const mockCreateCoachData = {
    name: 'Victor',
    email: 'v@gmail.com',
    password: '123456',
    confirmPassword: '123456',
  };

  describe('POST - coaches/create', () => {
    it('should create a new coach if provided data is valid', async () => {
      const res = await request(app.getHttpServer())
        .post('/coaches/create')
        .send(mockCreateCoachData);
      expect(res.statusCode).toBe(201);
      expect(res.body.id).toBeTruthy();
    });

    it('should create a list of default exercises to newly created users', async () => {
      const res = await request(app.getHttpServer())
        .post('/coaches/create')
        .send(mockCreateCoachData);

      const userExercises = await exerciseRepo.findBy({ coachId: res.body.id });
      expect(userExercises.length).toBeGreaterThan(0);
      expect(res.statusCode).toBe(201);
    });

    it('should fail to create a user with a taken email', async () => {
      await request(app.getHttpServer())
        .post('/coaches/create')
        .send(mockCreateCoachData);

      await request(app.getHttpServer())
        .post('/coaches/create')
        .send(mockCreateCoachData)
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

  describe('GET - coaches/me', () => {
    it('should return coach info', async () => {
      const coach = await coachFixture.createCoach(
        coachRepo,
        mockCreateCoachData,
      );
      const { access_token } = await authFixture.login(jwtService, coach);
      const res = await request(app.getHttpServer())
        .get('/coaches/me')
        .set('Cookie', [`accessToken=${access_token}`]);

      expect(res.statusCode).toBe(200);
      expect(res.body.coach.name).toMatch(mockCreateCoachData.name);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
