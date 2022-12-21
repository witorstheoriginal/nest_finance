import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUserEntity } from './types';

export const CurrentUser = createParamDecorator<unknown, ExecutionContext>(
  (_, ctx) => {
    const request = ctx.switchToHttp().getRequest();

    return request.user as CurrentUserEntity;
  },
);
