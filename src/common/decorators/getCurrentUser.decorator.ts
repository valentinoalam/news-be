import { JwtPayloadWithRt } from '@feat/auth/payloads/jwtPayloadWithRt.type';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetCurrentUser = createParamDecorator(
  (data: keyof JwtPayloadWithRt | undefined, context: ExecutionContext) => {
    const { user } = context.switchToHttp().getRequest();
    if (data) {
      return user[data];
    }
    return user;
  },
);
