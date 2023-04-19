import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coach } from './typeOrm/entities/Coach';
import { CoachesModule } from './coaches/coaches.module';
import { Box } from './typeOrm/entities/Box';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'genfit_dev',
      entities: [Coach, Box],
      synchronize: true,
    }),
    CoachesModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
