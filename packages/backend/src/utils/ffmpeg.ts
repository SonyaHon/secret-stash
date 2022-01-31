import { exec } from 'child_process';
import { Logger } from '../logger/logger';

export async function launchFfmpegTask(options: string[]): Promise<string> {
  return await new Promise<string>((resolve, reject) => {
    exec(`ffmpeg ${options.join(' ')}`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      Logger.info(`FFMpeg task finished`, {
        command: `ffmpeg ${options.join(' ')}`,
        stdout,
        stderr,
      });
      resolve(stdout);
    });
  });
}
