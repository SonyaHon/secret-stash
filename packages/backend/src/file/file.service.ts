import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FileDocument, FileSchemaName } from '../entities/file.entity';
import { Model } from 'mongoose';
import { stat, Stats, unlink } from 'fs';

@Injectable()
export class FileService {
  constructor(
    @InjectModel(FileSchemaName)
    private readonly fileModel: Model<FileDocument>,
  ) {}

  private async countFileSize(filepath: string): Promise<number> {
    const stats = await new Promise<Stats>((resolve, reject) =>
      stat(filepath, (err, stats) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(stats);
      }),
    );

    if (!stats) {
      throw new Error(`Could not check size of ${filepath}`);
    }
    return stats.size;
  }

  async storeFile(filepath: string, mimetype: string, filesize?: number) {
    const size = filesize ?? (await this.countFileSize(filepath));
    const file = new this.fileModel({ path: filepath, size, mimetype });
    await file.save();
    return file;
  }

  async removeFiles(files: FileDocument[]) {
    for (const file of files) {
      await new Promise<void>((resolve, reject) => {
        unlink(file.path, (error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      });
      await file.remove();
    }
  }
}
