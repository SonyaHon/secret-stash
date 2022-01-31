import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ActorDocument, ActorSchemaName } from '../entities/actor.entity';
import { Model, PipelineStage } from 'mongoose';
import { FileDocument } from '../entities/file.entity';
import { StringValueService } from '../string-value/string-value.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CropImageJob } from '../task-queue/image-cropper.consumer';
import { QueueName } from '../task-queue/queue-names';
import { filterFieldsFactory, Paginated } from '../utils/paginated';
import { RemoveFilesJob } from '../task-queue/file-remover.consumer';
import { DeleteActorFromVideosJob } from '../task-queue/videos-cleaner.consumer';
import { Logger } from '../logger/logger';

export interface ActorAddableInfo {
  name?: string;
  description?: string;
  eyeColor?: string;
  hairColor?: string;
  ethnicity?: string;
  penisSize?: number;
  breastsSize?: number;
  tags?: string[];
}

export interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
}

export enum SortOrder {
  ASC = 1,
  DESC = -1,
}

export interface ActorListFilter {
  pagination: {
    page: number;
    perPage: number;
  };
  sorting: {
    field: string;
    order: SortOrder;
  };
  filter: {
    name?: string;

    eyeColor?: string;
    hairColor?: string;
    ethnicity?: string;

    penisSize?: number[];
    breastsSize?: number[];
    tags?: string[];
  };
}

const stringFields = {
  eyeColor: 'color',
  hairColor: 'color',
  ethnicity: 'ethnicity',
  tags: 'tags',
};

@Injectable()
export class ActorService {
  constructor(
    @InjectModel(ActorSchemaName)
    private readonly actorModel: Model<ActorDocument>,
    private readonly stringValueService: StringValueService,
    @InjectQueue(QueueName.ImageCropper)
    private readonly imageCropperQueue: Queue<CropImageJob>,
    @InjectQueue(QueueName.FileRemover)
    private readonly fileRemoverQueue: Queue<RemoveFilesJob>,
    @InjectQueue(QueueName.VideoActorsCleaner)
    private readonly videoActorsCleanerQueue: Queue<DeleteActorFromVideosJob>,
  ) {}

  async createActors(actorNames: string[] | string): Promise<ActorDocument[]> {
    const names = typeof actorNames === 'string' ? [actorNames] : actorNames;
    return await this.actorModel.insertMany(names.map((name) => ({ name })));
  }

  async addInfo(
    actorId: string,
    data: ActorAddableInfo,
  ): Promise<ActorDocument> {
    const actor = await this.actorModel.findById(actorId);
    if (!actor) {
      throw new Error(`Actor ${actorId} not found.`);
    }

    for (const [key, value] of Object.entries(data)) {
      if (stringFields[key] !== undefined) {
        await this.stringValueService.insertValue(stringFields[key], value);
      }
      actor.set(key, value);
    }

    await actor.save();
    return actor;
  }

  async addAvatar(actorId: string, file: FileDocument, cropData: CropData) {
    const actor = await this.actorModel.findById(actorId);
    if (!actor) {
      throw new Error(`Actor ${actorId} not found.`);
    }
    actor.set('avatar', file._id);
    actor.set('avatarProcessing', true);
    await actor.save();

    await this.imageCropperQueue.add({
      ...cropData,
      filePath: file.path,
      actorId,
      field: 'avatarProcessing',
    });

    return actor;
  }

  async addPoster(actorId: string, file: FileDocument, cropData: CropData) {
    const actor = await this.actorModel.findById(actorId);
    if (!actor) {
      throw new Error(`Actor ${actorId} not found.`);
    }

    actor.set('poster', file._id);
    actor.set('posterProcessing', true);
    await actor.save();

    await this.imageCropperQueue.add({
      ...cropData,
      filePath: file.path,
      actorId,
      field: 'posterProcessing',
    });

    return actor;
  }

  async addHeroPoster(actorId: string, file: FileDocument, cropData: CropData) {
    const actor = await this.actorModel.findById(actorId);
    if (!actor) {
      throw new Error(`Actor ${actorId} not found.`);
    }

    actor.set('heroPoster', file._id);
    actor.set('heroPosterProcessing', true);
    await actor.save();

    await this.imageCropperQueue.add({
      ...cropData,
      filePath: file.path,
      actorId,
      field: 'heroPosterProcessing',
    });

    return actor;
  }

  async addAltPoster(actorId: string, file: FileDocument, cropData: CropData) {
    const actor = await this.actorModel.findById(actorId);
    if (!actor) {
      throw new Error(`Actor ${actorId} not found.`);
    }

    actor.set('altPoster', file._id);
    actor.set('altPosterProcessing', true);
    await actor.save();

    await this.imageCropperQueue.add({
      ...cropData,
      filePath: file.path,
      actorId,
      field: 'altPosterProcessing',
    });

    return actor;
  }

  async getActor(actorId: string): Promise<ActorDocument> {
    const actor = await this.actorModel.findById(actorId);
    if (!actor) {
      throw new Error(`Actor ${actorId} is not found`);
    }
    return actor;
  }

  async listActors(filter: ActorListFilter): Promise<Paginated<ActorDocument>> {
    const filterFields = filterFieldsFactory(filter);

    const regexpFilters = filterFields(['name'], (r, f, v) => ({
      ...r,
      [f]: { $regex: `.*${v}.*`, $options: 'i' },
    }));

    const exactFilters = filterFields(
      ['eyeColor', 'hairColor', 'ethnicity'],
      (r, f, v) => ({ ...r, [f]: v }),
    );

    const inClauses = filterFields(['penisSize', 'breastsSize'], (r, f, v) => ({
      ...r,
      [f]: { $in: v },
    }));

    const containsClauses = filterFields(['tags'], (r, f, v) => ({
      ...r,
      [f]: { $all: v },
    }));

    const mainQuery: PipelineStage[] = [
      {
        $match: {
          ...regexpFilters,
          ...exactFilters,
          ...inClauses,
          ...containsClauses,
        },
      },
    ];

    const totalEntries =
      (
        await this.actorModel
          .aggregate([...mainQuery, { $count: 'count' }])
          .exec()
      )[0]?.count || 0;
    const totalPages = Math.ceil(totalEntries / filter.pagination.perPage);

    const data = await this.actorModel
      .aggregate([
        ...mainQuery,
        { $sort: { [filter.sorting.field]: filter.sorting.order } },
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

  async removeActor(actorId: string): Promise<void> {
    const document = await this.actorModel.findById(actorId);
    if (!document) {
      throw new Error(`Actor ${actorId} is not found`);
    }

    const filesToDelete = [
      document.avatar,
      document.poster,
      document.heroPoster,
      document.altPoster,
    ].filter((el) => !!el);

    // @TODO: Check that corresponding files are being deleted!
    await this.fileRemoverQueue.add({ files: filesToDelete });
    // @TODO: Check that actor is deleted from corresponding videos!
    await this.videoActorsCleanerQueue.add({ actorId });

    await document.remove();
  }

  async updateImageProcessing(field: string, actorId: string) {
    const actor = await this.actorModel.findById(actorId);
    if (actor) {
      Logger.info('Updating actor data after image processing', {
        field,
        actorId,
      });
      actor.set(field, false);
      await actor.save();
    }
  }
}
