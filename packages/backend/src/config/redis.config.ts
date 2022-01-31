import { Config, EnvVar, Integer } from '@sonyahon/config';

@Config('REDIS')
export class RedisConfig {
  @EnvVar('HOST')
  public host = 'redis';

  @EnvVar('PORT')
  @Integer()
  public port = 6379;
}
