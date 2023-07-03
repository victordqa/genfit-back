import {
  Controller,
  Get,
  UseGuards,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { TrainningsService } from '../../services/trainnings/trainnings.service';
import { JwtAuthGuard } from '../../../auth/utils/JwtAuthGuard';
import { User } from '../../../coaches/controllers/coaches/decorators/user.decorator';
import { UserPayload } from '../../../utils/types';
import { SuggestTrainningDto } from '../../../trainning/dtos/SuggestTrainning.dto';
import { IsBoxOwnerGuard } from '../../../trainning/guards/is-box-owner/is-box-owner.guard';

@Controller('trainnings')
export class TrainningsController {
  constructor(private trainningsService: TrainningsService) {}

  @UseGuards(JwtAuthGuard, IsBoxOwnerGuard)
  @Get('suggest')
  suggestTrainning(
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
      boxId: query.boxId,
      quantity: query.quantity,
    });
  }
}
