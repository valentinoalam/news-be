import { Module } from '@nestjs/common';
import { TagService } from './tags.service';
import { TagController } from './tags.controller';

@Module({
  controllers: [TagController],
  providers: [TagService],
})
export class TagsModule {}
