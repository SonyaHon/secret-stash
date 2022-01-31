import { Injectable } from '@nestjs/common';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { InjectConfig } from '@sonyahon/config';
import { MongoConfig } from 'src/config/mongo.config';

@Injectable()
export class MongooseRootAdapter implements MongooseOptionsFactory {
  constructor(
    @InjectConfig(MongoConfig)
    private readonly mongoConfig: MongoConfig,
  ) {}

  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: `mongodb://${this.mongoConfig.host}:${this.mongoConfig.port}/${this.mongoConfig.database}`,
    };
  }
}
