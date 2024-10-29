import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/core/database/database.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private db: DatabaseService) {}

  async validate(value: any, args: any) {
    const [model, field] = args.constraints;
    // Check if a record with the given value exists
    const count = await this.db[model as string].count({
      where: {
        [field]: value,
      },
    });

    // Return true if no record is found, indicating uniqueness
    return count === 0;
  }
}

export function IsUnique(
  model: string,
  field: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [model, field],
      validator: IsUniqueConstraint,
    });
  };
}
