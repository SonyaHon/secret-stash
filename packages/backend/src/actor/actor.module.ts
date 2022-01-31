import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActorSchema, ActorSchemaName } from '../entities/actor.entity';
import { AuthModule } from '../auth/auth.module';
import { ActorController } from './actor.controller';
import { FileModule } from '../file/file.module';
import { StringValueModule } from '../string-value/string-value.module';
import { ActorService } from './actor.service';
import { BullModule } from '@nestjs/bull';
import { QueueName } from '../task-queue/queue-names';

@Module({
  imports: [
    BullModule.registerQueue({ name: QueueName.ImageCropper }),
    BullModule.registerQueue({ name: QueueName.FileRemover }),
    BullModule.registerQueue({ name: QueueName.VideoActorsCleaner }),
    MongooseModule.forFeature([{ name: ActorSchemaName, schema: ActorSchema }]),
    AuthModule,
    FileModule,
    StringValueModule,
  ],
  providers: [ActorService],
  controllers: [ActorController],
  exports: [ActorService],
})
export class ActorModule {}
