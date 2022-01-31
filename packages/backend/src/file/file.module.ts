import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { FileService } from './file.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FileSchemaName, FileSchema } from '../entities/file.entity';
import { access, mkdir } from 'fs';
import { FsConfig } from '../config/fs.config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: FileSchemaName, schema: FileSchema }]),
  ],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule implements OnApplicationBootstrap {
  private async directoryExists(path: string): Promise<boolean> {
    return await new Promise<boolean>((resolve) => {
      access(path, (error) => {
        resolve(!error);
      });
    });
  }

  private async createDirectory(path: string) {
    return new Promise<void>((resolve, reject) => {
      mkdir(path, (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }

  private async ensureDirectory(path: string) {
    if (!(await this.directoryExists(path))) {
      await this.createDirectory(path);
    }
  }
  async onApplicationBootstrap() {
    await this.ensureDirectory(FsConfig.uploadedImagesPath);
    await this.ensureDirectory(FsConfig.uploadedVideosPath);
  }
}
