import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string> {
  transform(value: string): string {
    const validObjectId = /^[a-f\d]{24}$/i;

    if (!validObjectId.test(value)) {
      throw new BadRequestException('Invalid ID format');
    }

    return value;
  }
}
