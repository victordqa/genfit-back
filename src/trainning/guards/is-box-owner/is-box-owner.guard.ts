import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CoachesService } from '../../../coaches/services/coaches/coaches.service';

@Injectable()
export class IsBoxOwnerGuard implements CanActivate {
  constructor(private coachesService: CoachesService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const coachId = request.user.sub;
    const boxId = parseInt(request.query.boxId);

    const boxes = await this.coachesService.listCoachBoxes(coachId);
    const boxesIds = boxes.map((b) => b.id);

    return boxesIds.includes(boxId);
  }
}
