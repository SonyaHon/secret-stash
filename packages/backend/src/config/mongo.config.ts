import { Config, EnvVar, Integer } from '@sonyahon/config';

@Config('MONGO')
export class MongoConfig {
  @EnvVar('HOST')
  public host = 'mongo';

  @EnvVar('PORT')
  @Integer()
  public port = 27017;

  public database = 'secretstash';
}
