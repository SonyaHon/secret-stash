import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigModule, getConfigToken } from '@sonyahon/config';
import { AppConfig } from '../config/app.config';
import { MongoConfig } from '../config/mongo.config';
import { RedisConfig } from '../config/redis.config';
import { Logger } from 'src/logger/logger';
import { LoggerNestJS } from '../logger/nestjs-adapter';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseRootAdapter } from './mongoose-root-adapter.provider';
import * as Session from 'express-session';
import * as RedisStoreFactory from 'connect-redis';
import { BullModule } from '@nestjs/bull';
import { AuthModule } from 'src/auth/auth.module';
import { createClient } from 'redis';
import { ActorModule } from '../actor/actor.module';
import { TaskQueueModule } from '../task-queue/task-queue.module';
import { VideoModule } from '../video/video.module';
import { VideoConfig } from '../config/video.config';
import { FileModule } from '../file/file.module';

@Module({
  imports: [
    ConfigModule.forRoot([AppConfig, MongoConfig, RedisConfig, VideoConfig], {
      defineGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseRootAdapter,
    }),
    BullModule.forRootAsync({
      useFactory: (config: RedisConfig) => ({
        redis: {
          host: config.host,
          port: config.port,
        },
      }),
      inject: [getConfigToken(RedisConfig)],
    }),
    TaskQueueModule,
    AuthModule,
    ActorModule,
    VideoModule,
    FileModule,
  ],
})
export class BootstrapModule {
  public static async Initialize() {
    const app = await NestFactory.create(BootstrapModule, {
      logger: new LoggerNestJS(),
    });

    const appConfig: AppConfig = app.get(getConfigToken(AppConfig));
    const redisConfig: RedisConfig = app.get(getConfigToken(RedisConfig));

    app.setGlobalPrefix('/api');
    app.enableCors();

    const RedisStore = RedisStoreFactory(Session);
    const redisClient: any = createClient({
      url: `redis://${redisConfig.host}:${redisConfig.port}/0`,
      legacyMode: true,
    });
    await redisClient.connect();

    app.use(
      Session({
        store: new RedisStore({ client: redisClient }),
        secret: appConfig.sessionSecret,
        resave: false,
        saveUninitialized: false,
      }),
    );

    await app.listen(appConfig.port, appConfig.host);
    Logger.info('Application is listening', {
      port: appConfig.port,
      host: appConfig.host,
    });
  }
}
