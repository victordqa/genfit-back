import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/utils/JwtAuthGuard';
import { User } from 'src/coaches/controllers/coaches/decorators/user.decorator';
import { CreateExerciseDto } from 'src/exercises/dtos/CreateExercise.dto';
import { ExercisesService } from 'src/exercises/services/exercises/exercises.service';
import { UserPayload } from 'src/utils/types';

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
}
