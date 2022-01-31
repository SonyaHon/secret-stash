import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { FileDocument, FileSchemaName } from './file.entity';
import * as mongoose from 'mongoose';

@Schema({ collection: 'actors' })
export class MongooseActor {
  @Prop()
  name: string;

  @Prop()
  description?: string;

  @Prop()
  eyeColor?: string;

  @Prop()
  hairColor?: string;

  @Prop()
  ethnicity?: string;

  @Prop({ default: () => 0 })
  penisSize: number;

  @Prop({ default: () => 0 })
  breastsSize: number;

  @Prop([String])
  tags?: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: FileSchemaName })
  avatar?: FileDocument;
  @Prop()
  avatarProcessing?: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: FileSchemaName })
  poster?: FileDocument;
  @Prop()
  posterProcessing?: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: FileSchemaName })
  heroPoster?: FileDocument;
  @Prop()
  heroPosterProcessing?: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: FileSchemaName })
  altPoster?: FileDocument;
  @Prop()
  altPosterProcessing?: boolean;
}

export type ActorDocument = Document & MongooseActor;
export const ActorSchemaName = MongooseActor.name;
export const ActorSchema = SchemaFactory.createForClass(MongooseActor);
