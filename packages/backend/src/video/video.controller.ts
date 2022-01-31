import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FsConfig } from '../config/fs.config';
import { FileService } from '../file/file.service';
import { VideoService } from './video.service';
import { CreateVideoDto } from './create-video.dto';
import { ListVideosDto } from './list-videos.dto';
import { SortOrder } from '../actor/actor.service';

@Controller('/videos')
export class VideoController {
  constructor(
    private readonly fileService: FileService,
    private readonly videoService: VideoService,
  ) {}

  @Post('/')
  @UseInterceptors(FileInterceptor('file', { storage: FsConfig.videoStorage }))
  async uploadAvatar(
    @UploadedFile()
    uploadedFile: Express.Multer.File,
    @Body()
    data: CreateVideoDto,
  ) {
    const file = await this.fileService.storeFile(
      uploadedFile.path,
      uploadedFile.mimetype,
      uploadedFile.size,
    );

    return await this.videoService.createVideo(file, {
      title: data.title,
      tags: data.tags
        ? []
        : typeof data.tags === 'string'
        ? [data.tags]
        : data.tags,
      actors: data.actors
        ? []
        : typeof data.actors === 'string'
        ? [data.actors]
        : data.actors,
    });
  }

  @Get('/:id')
  async getVideo(@Param('id') id: string) {
    return await this.videoService.getVideo(id);
  }

  @Delete('/:id')
  async deleteVideo(@Param('id') id: string) {
    return await this.videoService.removeVideo(id);
  }

  @Get('/')
  async listVideos(
    @Query()
    queryFilter: ListVideosDto,
  ) {
    const ifNot = <T>(
      value: string | string[] | undefined,
      field: string,
      transform: (value: string | string[]) => T,
      defaultValue?: T,
    ): any => {
      if (value === undefined) {
        return defaultValue ? { [field]: defaultValue } : {};
      }
      return { [field]: transform(value) };
    };
    const ifNotWrapper = (values: any[], field, provider) => {
      if (values.some((v) => !!v)) {
        return { [field]: provider() };
      }
      return {};
    };
    const nop = (v: string) => v;
    const convertToArrayAndMap = (mapper) => {
      return (value: string | string[]) => {
        const values = typeof value === 'string' ? [value] : value;
        return values.map(mapper);
      };
    };

    return await this.videoService.listVideos({
      pagination: {
        page: parseInt(queryFilter.page),
        perPage: parseInt(queryFilter.perPage),
      },
      sorting: {
        ...ifNot(queryFilter.sortField, 'field', nop, 'title'),
        ...ifNot(queryFilter.sortField, 'order', parseInt, SortOrder.DESC),
      },
      filter: {
        ...ifNot(queryFilter.title, 'title', nop),
        ...ifNot(queryFilter.tags, 'tags', convertToArrayAndMap(nop)),
        ...ifNotWrapper(
          [queryFilter.lengthFrom, queryFilter.lengthTo],
          'length',
          () => ({
            ...ifNot(queryFilter.lengthFrom, 'from', parseInt),
            ...ifNot(queryFilter.lengthTo, 'to', parseInt),
          }),
        ),
        ...ifNotWrapper(
          [queryFilter.timesWatchedFrom, queryFilter.timesWatchedTo],
          'length',
          () => ({
            ...ifNot(queryFilter.timesWatchedFrom, 'from', parseInt),
            ...ifNot(queryFilter.timesWatchedTo, 'to', parseInt),
          }),
        ),
        ...ifNot(queryFilter.actors, 'actors', convertToArrayAndMap(nop)),
      },
    });
  }

  @Delete('/:id')
  async removeVideo() {}
}
