import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coach } from './typeOrm/entities/Coach';
import { CoachesModule } from './coaches/coaches.module';
import { Box } from './typeOrm/entities/Box';

@Module({
  imports: [
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
