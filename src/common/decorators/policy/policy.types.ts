import { AppAbility } from '@/ability.factory';

export type PolicyHandlerCallback = (ability: AppAbility) => boolean;

export interface IPolicyHandler  {
  handle(ability: AppAbility): boolean;
}

export type PolicyHandler = IPolicyHandler  | PolicyHandlerCallback;
