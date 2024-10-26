import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ForbiddenError } from '@casl/ability';
import { AppAbility } from '@/ability.factory';
import { CHECK_POLICIES_KEY } from '@/common/decorators/policy/policy.decorator';
import { PolicyHandler } from '@/common/decorators/policy/policy.types';
import { AbilityFactory } from 'nest-casl/dist/factories/ability.factory';

type Handler = ((ability: any) => void) | { handle: (ability: any) => void };
@Injectable()
export class CaslAbilityGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const handlers: Handler[] =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const { user } = context.switchToHttp().getRequest();
    const ability = this.abilityFactory.createForUser(user);

    try {
      handlers.forEach((handler) => {
        if (typeof handler === 'function') {
          handler(ability);
        } else {
          handler.handle(ability);
        }
      });
    } catch (error) {
      if (error instanceof ForbiddenError) {
        return false;
      }
      throw error;
    }

    return true;
  }
}
