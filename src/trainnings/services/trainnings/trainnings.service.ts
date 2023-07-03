import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SuggestTrainningParams } from '../../../utils/types';
import { Repository } from 'typeorm';
import { Box } from '../../../typeOrm/entities/Box';

@Injectable()
export class TrainningsService {
  constructor(@InjectRepository(Box) private boxRepository: Repository<Box>) {}
  async suggestTrainning(suggestTrainningParams: SuggestTrainningParams) {
    //get trainning history from db
    // const history = this.trainningRepository
    // start recursive function with quantity of trainnings and history
    return { msg: 'Hello!' };
  }
}
