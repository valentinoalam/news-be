import { existsSync, mkdirSync } from 'fs';
import { extname } from 'path';

import { HttpException, HttpStatus } from '@nestjs/common';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

// Multer upload options
export const multerOptions = (configService: ConfigService) => ({
  // Enable file size limits
  // limits: {
  //   fileSize: +process.env.MAX_FILE_SIZE,
  // },
  // Check the mimetypes to allow for upload
  fileFilter: (req: any, file: Express.Multer.File, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      // Allow storage of file
      cb(null, true);
    } else {
      // Reject file
      cb(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
  // Storage properties
  storage: diskStorage({
    // Destination storage path details
    destination: async (req: any, file: any, cb: any) => {
      console.log(req);
      const sessionId = req.query.sessionId;
      const baseUploadPath = path.resolve(
        process.cwd(),
        '.',
        configService.get('app.mediaPath'),
      );
      const uploadPath = sessionId
        ? path.join(baseUploadPath, 'temp', sessionId)
        : baseUploadPath;

      // Create folder if it doesn't exist
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },
    // File modification details
    filename: (req: any, file: any, cb: any) => {
      const name = file.originalname.split('.')[0];
      const fileExtName = extname(file.originalname);
      // Calling the callback passing the random name generated with the original extension name
      cb(null, `${Date.now()}-${uuid(name)}${fileExtName}`);
    },
  }),
});
