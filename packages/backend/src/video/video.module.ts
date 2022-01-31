import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QueueName } from '../task-queue/queue-names';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { FileModule } from '../file/file.module';
import { StringValueModule } from '../string-value/string-value.module';
import { ActorModule } from '../actor/actor.module';
import { VideoSchema, VideoSchemaName } from '../entities/video.entity';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';

@Module({
  imports: [
    BullModule.registerQueue({ name: QueueName.FileRemover }),
    BullModule.registerQueue({ name: QueueName.VideoPosterGenerator }),
    BullModule.registerQueue({ name: QueueName.VideoPreviewGenerator }),
    MongooseModule.forFeature([{ name: VideoSchemaName, schema: VideoSchema }]),
    AuthModule,
    ActorModule,
    FileModule,
    StringValueModule,
  ],
  controllers: [VideoController],
  providers: [VideoService],
  exports: [VideoService],
})
export class VideoModule {}
