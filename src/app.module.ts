import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coach } from './typeOrm/entities/Coach';
import { CoachesModule } from './coaches/coaches.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'genfit_dev',
      entities: [Coach],
      synchronize: true,
    }),
    CoachesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
