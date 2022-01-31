import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { QueueName } from './queue-names';
import { launchFfmpegTask } from '../utils/ffmpeg';
import { nanoid } from 'nanoid';
import { copyFile, unlink } from 'fs';

import { Logger } from '../logger/logger';
import { ActorService } from '../actor/actor.service';

export interface CropImageJob {
  x: number;
  y: number;
  width: number;
  height: number;
  filePath: string;
  actorId: string;
  field: string;
}

@Processor(QueueName.ImageCropper)
export class ImageCropperConsumer {
  constructor(private readonly actorService: ActorService) {}

  @Process()
  async cropImage(job: Job<CropImageJob>) {
    const { x, y, width, height, filePath, actorId, field } = job.data;

    const tempFile = `/tmp/${nanoid()}.jpg`;
    await launchFfmpegTask([
      '-i',
      filePath,
      '-vf',
      `crop=${width}:${height}:${x}:${y}`,
      tempFile,
    ]);

    await new Promise<void>((resolve, reject) => {
      copyFile(tempFile, filePath, (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });

    await new Promise<void>((resolve, reject) => {
      unlink(tempFile, (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });

    Logger.info('Image cropping done', {
      filePath,
    });

    await this.actorService.updateImageProcessing(field, actorId);
  }
}
