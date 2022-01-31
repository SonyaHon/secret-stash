import { Process, Processor } from '@nestjs/bull';
import { QueueName } from './queue-names';
import { FileDocument } from '../entities/file.entity';
import { Job } from 'bull';
import { join } from 'path';
import { FsConfig } from '../config/fs.config';
import { nanoid } from 'nanoid';
import { launchFfmpegTask } from '../utils/ffmpeg';
import { FileService } from '../file/file.service';
import { VideoService } from '../video/video.service';
import { InjectConfig } from '@sonyahon/config';
import { VideoConfig } from '../config/video.config';

export interface GeneratePreviewJob {
  file: FileDocument;
  videoLength: number;
  videoId: string;
}

@Processor(QueueName.VideoPreviewGenerator)
export class VideoPreviewGeneratorConsumer {
  constructor(
    @InjectConfig(VideoConfig)
    private readonly videoConfig: VideoConfig,
    private readonly fileService: FileService,
    private readonly videoService: VideoService,
  ) {}

  private static async generateComplexFilterLine(
    start: number,
    end: number,
    id: number,
  ) {
    return `[0:v]scale=640:480:force_original_aspect_ratio=decrease,pad=640:480:-1:-1:color=black,trim=${start.toFixed(
      3,
    )}:${end.toFixed(3)},setpts=PTS-STARTPTS[v${id}];`;
  }

  private async generateComplexFilter(length: number): Promise<string[]> {
    const lines = [];
    const chunkSize = length / this.videoConfig.chunksCount;

    for (
      let chunkTimestamp = 0, chunkIndex = 0;
      chunkTimestamp < length;
      chunkTimestamp += chunkSize, chunkIndex++
    ) {
      lines.push(
        await VideoPreviewGeneratorConsumer.generateComplexFilterLine(
          chunkTimestamp,
          chunkTimestamp + this.videoConfig.chunkLength,
          chunkIndex,
        ),
      );
    }

    let lastLine = '';
    for (let i = 0; i < this.videoConfig.chunksCount; i++) {
      lastLine += `[v${i}]`;
    }
    lastLine += `concat=n=${this.videoConfig.chunksCount}:v=1:a=0[out]`;
    lines.push(lastLine);

    return ['-filter_complex', `"${lines.join('')}"`, '-map', '[out]'];
  }

  private static async generateVideoFilter(): Promise<string[]> {
    return [
      '-vf',
      'scale=640:480:force_original_aspect_ratio=decrease,pad=640:480:-1:-1:color=black',
    ];
  }

  @Process()
  async generatePreview(job: Job<GeneratePreviewJob>) {
    const generatedPath = join(FsConfig.uploadedVideosPath, `${nanoid()}.mp4`);
    const { file, videoId, videoLength } = job.data;
    let filter: string[];
    if (
      videoLength <
      this.videoConfig.chunksCount * this.videoConfig.chunkLength + 1
    ) {
      filter = await VideoPreviewGeneratorConsumer.generateVideoFilter();
    } else {
      filter = await this.generateComplexFilter(videoLength);
    }

    console.log('OPTIONS', ['-i', file.path, ...filter, generatedPath]);
    await launchFfmpegTask(['-i', file.path, ...filter, generatedPath]);

    const generatedFile = await this.fileService.storeFile(
      generatedPath,
      'video/mp4',
    );

    await this.videoService.updateForPreview(videoId, generatedFile);
  }
}
