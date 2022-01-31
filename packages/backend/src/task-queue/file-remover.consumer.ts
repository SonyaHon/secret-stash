import { Process, Processor } from '@nestjs/bull';
import { QueueName } from './queue-names';
import { FileDocument } from '../entities/file.entity';
import { Job } from 'bull';
import { FileService } from '../file/file.service';

export interface RemoveFilesJob {
  files: FileDocument[];
}

@Processor(QueueName.FileRemover)
export class FileRemoverConsumer {
  constructor(private readonly fileService: FileService) {}
  @Process()
  async removeFiles(job: Job<RemoveFilesJob>) {
    await this.fileService.removeFiles(job.data.files);
  }
}
