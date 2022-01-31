import { Config, EnvVar, Integer } from '@sonyahon/config';

@Config('VIDEO')
export class VideoConfig {
  @EnvVar('CHUNKS_COUNT')
  @Integer()
  public chunksCount = 5;

  @EnvVar('CHUNK_LENGTH')
  @Integer()
  public chunkLength = 3;
}
