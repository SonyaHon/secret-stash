import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { FileDocument, FileSchemaName } from './file.entity';
import * as mongoose from 'mongoose';
import { ActorDocument, ActorSchemaName } from './actor.entity';

@Schema({ collection: 'videos' })
export class MongooseVideo {
  @Prop()
  title: string;

  @Prop()
  length: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: FileSchemaName })
  src: FileDocument;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: FileSchemaName })
  poster?: FileDocument;

  @Prop()
  posterProcessing?: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: FileSchemaName })
  preview?: FileDocument;

  @Prop()
  previewProcessing?: boolean;

  @Prop([String])
  tags: string[];

  @Prop({ default: () => 0 })
  timesWatched: number;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: ActorSchemaName }],
  })
  actors: ActorDocument[];
}

export type VideoDocument = Document & MongooseVideo;
export const VideoSchemaName = MongooseVideo.name;
export const VideoSchema = SchemaFactory.createForClass(MongooseVideo);
