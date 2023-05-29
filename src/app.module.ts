import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoachesModule } from './coaches/coaches.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { dataSourceOptionsFactory } from './utils/dataSource';
import { ExercisesModule } from './exercises/exercises.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // load: [dataSourceOptionsFactory],
    }),
    TypeOrmModule.forRoot(dataSourceOptionsFactory()),
    CoachesModule,
    AuthModule,
    ExercisesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
