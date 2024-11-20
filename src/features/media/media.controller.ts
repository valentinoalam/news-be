import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MediaService } from './media.service';
import { RoleGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
// import { CreateMediaItemDto } from './dto/create-media.dto';
// import { UpdateMediaItemDto } from './dto/update-media.dto';

@ApiTags('media')
@Controller('media')
@UseGuards(RoleGuard)
@ApiBearerAuth()
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  @Roles(Role.EDITOR, Role.AUTHOR)
  findAll() {
    return this.mediaService.findAll();
  }

  @Post('temp')
  @UseInterceptors(FileInterceptor('file'))
  uploadTemp(
    @UploadedFile() file: Express.Multer.File,
    @Body('sessionId') sessionId: string,
  ) {
    return this.mediaService.uploadTemp(file, sessionId);
  }

  @Post('make-permanent')
  makePermanent(
    @Body('sessionId') sessionId: string,
    @Body('articleId') articleId: string,
  ) {
    return this.mediaService.makePermanent(sessionId, articleId);
  }
}
