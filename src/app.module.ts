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
      host: process.env.DB_HOST,
      port: parseInt(process.env.PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB,
      entities: [Coach, Box],
      synchronize: process.env.DB_SYNC === 'true',
    }),
    CoachesModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
