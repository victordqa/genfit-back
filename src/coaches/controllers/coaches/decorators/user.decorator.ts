import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from 'src/utils/types';

export const User = createParamDecorator(
  (data: UserPayload, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
