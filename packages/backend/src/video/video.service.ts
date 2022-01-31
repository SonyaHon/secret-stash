import { Injectable } from '@nestjs/common';
import { FileDocument } from '../entities/file.entity';
import { VideoDocument, VideoSchemaName } from '../entities/video.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectQueue } from '@nestjs/bull';
import { QueueName } from '../task-queue/queue-names';
import { Queue } from 'bull';
import { GeneratePosterJob } from '../task-queue/video-poster-generator.consumer';
import { GeneratePreviewJob } from '../task-queue/video-preview-generator.consumer';
import { launchFfprobeTask } from '../utils/ffmpeg';

export interface CreateVideoData {
  title: string;
  tags: string[];
  actors: string[];
}

@Injectable()
export class VideoService {
  constructor(
    @InjectModel(VideoSchemaName)
    private readonly videoModel: Model<VideoDocument>,
    @InjectQueue(QueueName.VideoPosterGenerator)
    private readonly posterGeneratorQueue: Queue<GeneratePosterJob>,
    @InjectQueue(QueueName.VideoPreviewGenerator)
    private readonly previewGeneratorQueue: Queue<GeneratePreviewJob>,
  ) {}

  private static async countVideoLength(file: FileDocument): Promise<number> {
    const result = await launchFfprobeTask([
      '-v',
      'error',
      '-show_entries',
      'format=duration',
      '-of',
      'default=noprint_wrappers=1:nokey=1',
      file.path,
    ]);
    console.log('Video length result:', result);
    return parseInt(result);
  }

  async createVideo(
    file: FileDocument,
    data: CreateVideoData,
  ): Promise<VideoDocument> {
    const videoLength = await VideoService.countVideoLength(file);

    const video = new this.videoModel({
      title: data.title,
      length: videoLength,
      src: file._id,
      posterProcessing: true,
      previewProcessing: true,
      tags: data.tags,
      actors: data.actors,
    });
    await video.save();

    await this.posterGeneratorQueue.add({
      file,
      videoId: video._id,
      timestamp: Math.floor(videoLength / 2),
    });
    await this.previewGeneratorQueue.add({
      file,
      videoId: video._id,
      videoLength,
    });

    return video;
  }

  async updateForPoster(videoId: string, generatedFile: FileDocument) {
    const video = await this.videoModel.findById(videoId);
    if (!video) return;

    video.poster = generatedFile._id;
    video.posterProcessing = false;

    await video.save();
  }

  async updateForPreview(videoId: string, generatedFile: FileDocument) {
    const video = await this.videoModel.findById(videoId);
    if (!video) return;

    video.preview = generatedFile._id;
    video.previewProcessing = false;

    await video.save();
  }
}
