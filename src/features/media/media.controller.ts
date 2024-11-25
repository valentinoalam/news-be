import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
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
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a temporary file' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        sessionId: {
          type: 'string',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  uploadTemp(
    @UploadedFile() file: Express.Multer.File,
    @Body('sessionId') sessionId: string,
  ) {
    return this.mediaService.uploadTemp(file, sessionId);
  }

  @Post('make-permanent')
  @ApiOperation({ summary: 'Make a temporary file permanent' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        sessionId: {
          type: 'string',
        },
        articleId: {
          type: 'string',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'File made permanent successfully' })
  makePermanent(
    @Body('sessionId') sessionId: string,
    @Body('articleId') articleId: string,
  ) {
    return this.mediaService.makePermanent(sessionId, articleId);
  }
}
