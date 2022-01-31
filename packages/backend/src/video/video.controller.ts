import {
  Body,
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FsConfig } from '../config/fs.config';
import { FileService } from '../file/file.service';
import { VideoService } from './video.service';
import { CreateVideoDto } from './create-video.dto';

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
}
