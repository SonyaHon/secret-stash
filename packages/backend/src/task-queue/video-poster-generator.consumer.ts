import { Process, Processor } from '@nestjs/bull';
import { QueueName } from './queue-names';
import { Job } from 'bull';
import { FileDocument } from '../entities/file.entity';
import { join } from 'path';
import { FsConfig } from '../config/fs.config';
import { nanoid } from 'nanoid';
import { launchFfmpegTask } from '../utils/ffmpeg';
import { FileService } from '../file/file.service';
import { VideoService } from '../video/video.service';

export interface GeneratePosterJob {
  timestamp: number;
  file: FileDocument;
  videoId: string;
}

@Processor(QueueName.VideoPosterGenerator)
export class VideoPosterGeneratorConsumer {
  private static videoFilter =
    'scale=640:480:force_original_aspect_ratio=decrease,pad=640:480:-1:-1:color=black';

  constructor(
    private readonly fileService: FileService,
    private readonly videoService: VideoService,
  ) {}

  @Process()
  async generatePoster(job: Job<GeneratePosterJob>) {
    const generatedPath = join(FsConfig.uploadedImagesPath, `${nanoid()}.jpeg`);
    const { timestamp, file, videoId } = job.data;
    await launchFfmpegTask([
      '-ss',
      `${timestamp}`,
      '-i',
      file.path,
      '-vf',
      VideoPosterGeneratorConsumer.videoFilter,
      '-vframes',
      '1',
      generatedPath,
    ]);

    const generatedFile = await this.fileService.storeFile(
      generatedPath,
      'img/jpeg',
    );

    await this.videoService.updateForPoster(videoId, generatedFile);
  }
}
