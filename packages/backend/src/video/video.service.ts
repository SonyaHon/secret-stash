import { Injectable } from '@nestjs/common';
import { FileDocument } from '../entities/file.entity';
import { VideoDocument, VideoSchemaName } from '../entities/video.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { InjectQueue } from '@nestjs/bull';
import { QueueName } from '../task-queue/queue-names';
import { Queue } from 'bull';
import { GeneratePosterJob } from '../task-queue/video-poster-generator.consumer';
import { GeneratePreviewJob } from '../task-queue/video-preview-generator.consumer';
import { launchFfprobeTask } from '../utils/ffmpeg';
import { filterFieldsFactory, Paginated } from '../utils/paginated';
import { SortOrder } from '../actor/actor.service';
import { RemoveFilesJob } from '../task-queue/file-remover.consumer';

export interface CreateVideoData {
  title: string;
  tags: string[];
  actors: string[];
}

export interface ListVideosFilter {
  pagination: {
    page: number;
    perPage: number;
  };
  sorting: {
    field: string;
    order: SortOrder;
  };
  filter: {
    title?: string;
    length?: {
      from?: number;
      to?: number;
    };
    timesWatched?: {
      from?: number;
      to?: number;
    };
    tags?: string[];
    actors?: string[];
  };
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
    @InjectQueue(QueueName.FileRemover)
    private readonly fileRemoverQueue: Queue<RemoveFilesJob>,
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

  async getVideo(videoId: string): Promise<VideoDocument> {
    const video = await this.videoModel.findById(videoId);
    if (!video) {
      throw new Error(`Video ${videoId} is not found`);
    }

    await video.populate('src');
    await video.populate('poster');
    await video.populate('preview');
    await video.populate('actors');

    return video;
  }

  async removeVideo(videoId: string) {
    const video = await this.videoModel.findById(videoId);
    if (!video) {
      throw new Error(`Video ${videoId} not found`);
    }

    const filesToDelete = [video.src, video.preview, video.poster].filter(
      (el) => !!el,
    );

    await this.fileRemoverQueue.add({ files: filesToDelete });
    await video.remove();
  }

  async listVideos(
    filter: ListVideosFilter,
  ): Promise<Paginated<VideoDocument[]>> {
    const filterFields = filterFieldsFactory(filter);

    const regexpFilters = filterFields(['title'], (r, f, v) => ({
      ...r,
      [f]: { $regex: `.*${v}.*`, $options: 'i' },
    }));

    const containsClauses = filterFields(['tags', 'actors'], (r, f, v) => ({
      ...r,
      [f]: { $all: v },
    }));

    const intervalClauses = filterFields(
      ['length', 'timesWatched'],
      (r, f, v) => ({
        ...r,
        [f]: { $gt: v.from || 0 },
        [f]: { $lt: v.to || Number.MAX_SAFE_INTEGER },
      }),
    );

    const mainQuery: PipelineStage[] = [
      {
        $match: {
          ...regexpFilters,
          ...containsClauses,
          ...intervalClauses,
        },
      },
    ];

    const totalEntries =
      (
        await this.videoModel
          .aggregate([...mainQuery, { $count: 'count' }])
          .exec()
      )[0]?.count || 0;
    const totalPages = Math.ceil(totalEntries / filter.pagination.perPage);

    const data = await this.videoModel
      .aggregate([
        ...mainQuery,

        ...(filter.sorting.field === 'random'
          ? [{ $sample: { size: totalEntries } }]
          : [{ $sort: { [filter.sorting.field]: filter.sorting.order } }]),

        { $skip: filter.pagination.page * filter.pagination.perPage },
        { $limit: filter.pagination.perPage },
      ])
      .exec();

    return {
      pagination: {
        page: filter.pagination.page,
        itemsPerPage: filter.pagination.perPage,
        totalPages,
      },
      data,
    };
  }
}
