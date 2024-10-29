import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
  // Body,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { MediaService } from './media.service';
import { RolesGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
// import { CreateMediaItemDto } from './dto/create-media.dto';
// import { UpdateMediaItemDto } from './dto/update-media.dto';

@ApiTags('media')
@Controller('media')
@UseGuards(RolesGuard)
@ApiBearerAuth()
@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly configService: ConfigService,
  ) {}

  @Post('upload')
  @Roles(Role.EDITOR, Role.AUTHOR)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.mediaService.create({
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
      url: `/uploads/${file.filename}`, // Assuming you have file storage configured
    });
  }
  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const imageUrl = `/uploads/${file.filename}`; // Adjust this URL if using a cloud storage service
    return { imageUrl };
  }

  @Get()
  @Roles(Role.EDITOR, Role.AUTHOR)
  findAll() {
    return this.mediaService.findAll();
  }
}
