import { PartialType } from '@nestjs/swagger';
import { CreateMediaItemDto } from './create-media.dto';

export class UpdateMediaItemDto extends PartialType(CreateMediaItemDto) {}
