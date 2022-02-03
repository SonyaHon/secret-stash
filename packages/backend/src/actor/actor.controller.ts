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
import { ActorService, SortOrder } from './actor.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FsConfig } from '../config/fs.config';
import { FileService } from '../file/file.service';
import { AddActorInfoDto } from './add-actor-info.dto';
import { CropDataDto } from './crop-data.dto';
import { CreateActorsDto } from './create-actors.dto';
import { ActorsListQueryDto } from './actors-list-query.dto';

@Controller('/actors')
export class ActorController {
  constructor(
    private readonly actorService: ActorService,
    private readonly fileService: FileService,
  ) {}

  @Get()
  async listActors(@Query() queryFilter: ActorsListQueryDto) {
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
    const nop = (v: string) => v;
    const convertToArrayAndMap = (mapper) => {
      return (value: string | string[]) => {
        const values = typeof value === 'string' ? [value] : value;
        return values.map(mapper);
      };
    };

    return await this.actorService.listActors({
      pagination: {
        page: parseInt(queryFilter.page),
        perPage: parseInt(queryFilter.perPage),
      },
      sorting: {
        ...ifNot(queryFilter.sortField, 'field', nop, 'name'),
        ...ifNot(queryFilter.sortOrder, 'order', parseInt, SortOrder.DESC),
      },
      filter: {
        ...ifNot(queryFilter.name, 'name', nop),
        ...ifNot(queryFilter.eyeColor, 'eyeColor', nop),
        ...ifNot(queryFilter.eyeColor, 'hairColor', nop),
        ...ifNot(
          queryFilter.penisSize,
          'penisSize',
          convertToArrayAndMap((v) => parseInt(v)),
        ),
        ...ifNot(
          queryFilter.breastsSize,
          'breastsSize',
          convertToArrayAndMap((v) => parseInt(v)),
        ),
        ...ifNot(queryFilter.tags, 'tags', convertToArrayAndMap(nop)),
      },
    });
  }

  @Get('/:id')
  async getActor(@Param('id') id: string) {
    return await this.actorService.getActor(id);
  }

  @Delete('/:id')
  async removeActor(@Param('id') id: string) {
    return await this.actorService.removeActor(id);
  }

  @Post()
  async createActors(@Body() data: CreateActorsDto) {
    const names = typeof data.name === 'string' ? [data.name] : data.name;
    return await this.actorService.createActors(names);
  }

  @Post('/:id/info')
  async addInfo(@Param('id') actorId: string, @Body() info: AddActorInfoDto) {
    return await this.actorService.addInfo(actorId, {
      ...info,
      penisSize: info.penisSize ? parseInt(info.penisSize) : undefined,
      breastsSize: info.breastsSize ? parseInt(info.breastsSize) : undefined,
    });
  }

  @Post('/:id/avatar')
  @UseInterceptors(FileInterceptor('file', { storage: FsConfig.imageStorage }))
  async uploadAvatar(
    @Param('id')
    actorId: string,
    @Body() cropData: CropDataDto,
    @UploadedFile()
    uploadedFile: Express.Multer.File,
  ) {
    const file = await this.fileService.storeFile(
      uploadedFile.path,
      uploadedFile.mimetype,
      uploadedFile.size,
    );
    return await this.actorService.addAvatar(actorId, file, {
      x: parseInt(cropData.x),
      y: parseInt(cropData.y),
      width: parseInt(cropData.width),
      height: parseInt(cropData.height),
    });
  }

  @Post('/:id/poster')
  @UseInterceptors(FileInterceptor('file', { storage: FsConfig.imageStorage }))
  async uploadPoster(
    @Param('id')
    actorId: string,
    @Body() cropData: CropDataDto,
    @UploadedFile()
    uploadedFile: Express.Multer.File,
  ) {
    const file = await this.fileService.storeFile(
      uploadedFile.path,
      uploadedFile.mimetype,
      uploadedFile.size,
    );
    return await this.actorService.addPoster(actorId, file, {
      x: parseInt(cropData.x),
      y: parseInt(cropData.y),
      width: parseInt(cropData.width),
      height: parseInt(cropData.height),
    });
  }

  @Post('/:id/hero-poster')
  @UseInterceptors(FileInterceptor('file', { storage: FsConfig.imageStorage }))
  async uploadHeroPoster(
    @Param('id')
    actorId: string,
    @Body() cropData: CropDataDto,
    @UploadedFile()
    uploadedFile: Express.Multer.File,
  ) {
    const file = await this.fileService.storeFile(
      uploadedFile.path,
      uploadedFile.mimetype,
      uploadedFile.size,
    );
    return await this.actorService.addHeroPoster(actorId, file, {
      x: parseInt(cropData.x),
      y: parseInt(cropData.y),
      width: parseInt(cropData.width),
      height: parseInt(cropData.height),
    });
  }

  @Post('/:id/alt-poster')
  @UseInterceptors(FileInterceptor('file', { storage: FsConfig.imageStorage }))
  async uploadAltPoster(
    @Param('id')
    actorId: string,
    @Body() cropData: CropDataDto,
    @UploadedFile()
    uploadedFile: Express.Multer.File,
  ) {
    const file = await this.fileService.storeFile(
      uploadedFile.path,
      uploadedFile.mimetype,
      uploadedFile.size,
    );
    return await this.actorService.addAltPoster(actorId, file, {
      x: parseInt(cropData.x),
      y: parseInt(cropData.y),
      width: parseInt(cropData.width),
      height: parseInt(cropData.height),
    });
  }
}
