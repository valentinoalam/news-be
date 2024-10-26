import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest(); // as Request;

    await super.logIn(request);
    const userId = request.user['id']; // Assuming the user ID is stored in the 'id' property of the user object
    request.userId = userId;
    return true;
  }
}
