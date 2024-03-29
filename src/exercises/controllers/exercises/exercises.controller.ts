import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/utils/JwtAuthGuard';
import { User } from '../../../coaches/controllers/coaches/decorators/user.decorator';
import { UserPayload } from '../../../utils/types';
import { CreateExerciseDto } from '../../dtos/CreateExercise.dto';
import { ExercisesService } from '../../services/exercises/exercises.service';
import { SearchExerciseDto } from '../../dtos/SearchExercise.dto';

@Controller('exercises')
export class ExercisesController {
  constructor(private exercisesService: ExercisesService) {}

  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createExercise(
    @Body() createExercise: CreateExerciseDto,
    @User() userPayload: UserPayload,
  ) {
    return { userPayload };
  }

  @UseGuards(JwtAuthGuard)
  @Get('list')
  async listExercisesAndPreloads(@User() userPayload: UserPayload) {
    const exercises = await this.exercisesService.listExercises(
      userPayload.sub,
    );
    return exercises;
  }

  @UseGuards(JwtAuthGuard)
  @Get('list-filtered')
  async listFilteredExercisesAndPreloads(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    query: SearchExerciseDto,
    @User() userPayload: UserPayload,
  ) {
    const exercises = await this.exercisesService.listExercisesFiltered(
      query,
      userPayload.sub,
    );
    return exercises;
  }

  @UseGuards(JwtAuthGuard)
  @Get('list-modifiers')
  async listModifiers() {
    const modifiers = await this.exercisesService.listModifiers();
    return modifiers;
  }
}
