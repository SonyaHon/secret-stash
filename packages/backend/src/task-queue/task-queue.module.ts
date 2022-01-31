import { Global, Module } from '@nestjs/common';
import { ImageCropperConsumer } from './image-cropper.consumer';

import { FileRemoverConsumer } from './file-remover.consumer';
import { VideosCleanerConsumer } from './videos-cleaner.consumer';

import { ActorModule } from '../actor/actor.module';
import { FileModule } from '../file/file.module';
import { VideoPosterGeneratorConsumer } from './video-poster-generator.consumer';
import { VideoPreviewGeneratorConsumer } from './video-preview-generator.consumer';
import { VideoModule } from '../video/video.module';

@Global()
@Module({
  imports: [ActorModule, FileModule, VideoModule],
  providers: [
    ImageCropperConsumer,
    FileRemoverConsumer,
    VideosCleanerConsumer,
    VideoPosterGeneratorConsumer,
    VideoPreviewGeneratorConsumer,
  ],
  exports: [
    ImageCropperConsumer,
    FileRemoverConsumer,
    VideosCleanerConsumer,
    VideoPosterGeneratorConsumer,
    VideoPreviewGeneratorConsumer,
  ],
})
export class TaskQueueModule {}
