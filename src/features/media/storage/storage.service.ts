import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  copyFile,
  existsSync,
  mkdir,
  mkdirSync,
  readdir,
  rmdir,
  unlink,
  unlinkSync,
  writeFile,
} from 'fs';
import { dirname, join, sep } from 'path';

@Injectable()
export class StorageService {
  private readonly storagePath: string;
  private readonly uploadDir: string;
  private readonly baseUrl: string;
  constructor(private readonly configService: ConfigService) {
    this.storagePath = join(
      process.cwd(),
      '..',
      this.configService.get<string>('app.mediaPath'),
    );
    this.uploadDir = join(process.cwd(), 'uploads');
    this.baseUrl = 'http://localhost:3000'; // Set your base URL here
  }

  // Upload directory resolver
  private checkUploadDir(dir: string): string {
    const fullPath = this.getFilePath(dir);
    if (!existsSync(fullPath)) {
      mkdirSync(fullPath, { recursive: true });
    }
    return fullPath;
  }

  // Ensure directories exist
  private async ensureUploadDir() {
    const dirs = ['temp', 'articles'].map((dir) => join(this.uploadDir, dir));

    for (const dir of dirs) {
      if (!existsSync(dir)) {
        try {
          await new Promise<void>((resolve, reject) =>
            mkdir(dir, { recursive: true }, (err) =>
              err ? reject(err) : resolve(),
            ),
          );
        } catch (error) {
          throw new InternalServerErrorException(
            'Failed to create upload directories',
          );
        }
      }
    }
  }

  // Get full file path based on relative file path
  private getFilePath(filePath: string): string {
    return join(this.uploadDir, filePath);
  }

  // Get URL for accessing the file
  private getFileUrl(filePath: string): string {
    const relativePath = filePath.split(sep).join('/'); // Normalize path for URL
    return `${this.baseUrl}/uploads/${relativePath}`;
  }

  async upload(buffer: Buffer, filePath: string): Promise<string> {
    try {
      const fullPath = await this.checkUploadDir(filePath); // Ensure directory exists
      // Write file
      await writeFile(fullPath, buffer, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
      });

      // Return public URL
      return this.getFileUrl(filePath);
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  move(oldPath: string, newPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const fullOldPath = join(this.storagePath, oldPath);
      const fullNewPath = join(this.storagePath, newPath);
      const newDir = dirname(fullNewPath);

      // Check if the old file exists
      if (!existsSync(fullOldPath)) {
        return reject(new NotFoundException('Old file not found'));
      }

      // Create the target directory if it does not exist
      mkdir(newDir, { recursive: true }, (mkdirErr) => {
        if (mkdirErr) {
          return reject(
            new InternalServerErrorException('Failed to create directory'),
          );
        }

        // Copy the file to the new location
        copyFile(fullOldPath, fullNewPath, (copyErr) => {
          if (copyErr) {
            return reject(
              new InternalServerErrorException('Failed to copy the file'),
            );
          }

          // Delete the old file
          unlink(fullOldPath, (unlinkErr) => {
            if (unlinkErr) {
              return reject(
                new InternalServerErrorException(
                  'Failed to delete the old file',
                ),
              );
            }

            resolve(`File moved to ${fullNewPath}`);
          });
        });
      });
    });
  }

  deleteImage(filename: string): void {
    const filePath = join(this.storagePath, filename);

    if (!existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    try {
      unlinkSync(filePath);
    } catch (error) {
      throw new Error('Failed to delete the file');
    }
  }

  // Recursively clean up empty directories
  private async cleanEmptyDirs(dir: string) {
    if (dir === this.uploadDir || dirname(dir) === this.uploadDir) {
      return; // Skip base directory and its main subdirectories
    }

    try {
      const files = await new Promise<string[]>((resolve, reject) =>
        readdir(dir, (err, files) => (err ? reject(err) : resolve(files))),
      );

      if (files.length === 0) {
        await new Promise<void>((resolve, reject) =>
          rmdir(dir, (err) => (err ? reject(err) : resolve())),
        );

        // Recursively check and clean parent directory
        await this.cleanEmptyDirs(dirname(dir));
      }
    } catch (error) {
      // Ignoring errors in cleanup operations
    }
  }
}
