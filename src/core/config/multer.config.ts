import { existsSync, mkdirSync } from 'fs';
import { extname } from 'path';

import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import * as path from 'path';
// Multer configuration
export const multerConfig = {
  dest: path.resolve(process.cwd(), '..', process.env.UPLOAD_LOCATION),
};

// Multer upload options
export const multerOptions = {
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
    destination: (req: any, file: any, cb: any) => {
      const uploadPath = multerConfig.dest;
      // Create folder if doesn't exist
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
    },
    // File modification details
    filename: (req: Request, file: any, cb: any) => {
      const name = file.originalname.split('.')[0];
      const fileExtName = extname(file.originalname);
      const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      // Calling the callback passing the random name generated with the original extension name
      cb(null, `${uuid(name)}-${randomName}${fileExtName}`);
    },
  }),
};
