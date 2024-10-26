import { Injectable } from '@nestjs/common';
import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from '@casl/ability';
import { Role } from './features/role/entities/role.entity';
import { User } from './features/users/entities';

// Define the available actions
export enum Action {
  Manage = 'manage',  // wildcard for any action
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

// Define the subjects of your abilities
type Subjects = InferSubjects<typeof User | typeof Role> | 'all';
// Define the ability type
export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  defineAbility(user: User, roles: string[]): AppAbility {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(Ability as any);

    if (roles.includes('ADMIN')) {
      can(Action.Manage, 'all');  // Admin can manage everything
    } else {
      can(Action.Read, User);      // Regular users can only read themselves
      cannot(Action.Delete, User); // Prevent regular users from deleting accounts
    }

    return build({
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
