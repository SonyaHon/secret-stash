import { Global, Module } from '@nestjs/common';
import { ImageCropperConsumer } from './image-cropper.consumer';

import { FileRemoverConsumer } from './file-remover.consumer';
import { VideosCleanerConsumer } from './videos-cleaner.consumer';

import { ActorModule } from '../actor/actor.module';
import { FileModule } from '../file/file.module';

@Global()
@Module({
  imports: [
    ActorModule,
    FileModule,
    // MongooseModule.forFeature([{ name: ActorSchemaName, schema: ActorSchema }]),
  ],
  providers: [ImageCropperConsumer, FileRemoverConsumer, VideosCleanerConsumer],
  exports: [ImageCropperConsumer, FileRemoverConsumer, VideosCleanerConsumer],
})
export class TaskQueueModule {}
