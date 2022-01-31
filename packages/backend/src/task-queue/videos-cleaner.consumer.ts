import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { QueueName } from './queue-names';

export interface DeleteActorFromVideosJob {
  actorId: string;
}

@Processor(QueueName.VideoActorsCleaner)
export class VideosCleanerConsumer {
  @Process()
  async deleteActorFromVideos(job: Job<DeleteActorFromVideosJob>) {
    // @TODO: Implement this
  }
}
