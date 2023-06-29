import {
  Controller,
  Get,
  ParseIntPipe,
  UseGuards,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { TrainningsService } from '../../services/trainnings/trainnings.service';
import { JwtAuthGuard } from '../../../auth/utils/JwtAuthGuard';
import { User } from '../../../coaches/controllers/coaches/decorators/user.decorator';
import { UserPayload } from '../../../utils/types';
import { SuggestTrainningDto } from '../../../trainning/dtos/SuggestTrainning.dto';

@Controller('trainnings')
export class TrainningsController {
  constructor(private trainningsService: TrainningsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('suggest')
  suggestTrainning(
    @User() userPayload: UserPayload,
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    query: SuggestTrainningDto,
  ) {
    return this.trainningsService.suggestTrainning({
      coachId: userPayload.sub,
      quantity: query.quantity,
    });
  }
}
