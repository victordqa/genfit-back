import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SuggestTrainningParams } from '../../../utils/types';

@Injectable()
export class TrainningsService {
  //constructor(@InjectRepository())
  async suggestTrainning(suggestTrainningDetails: SuggestTrainningParams) {
    //get trainning history from db
    // const history = this.trainningRepository
    return { msg: 'Hello!' };
  }
}
