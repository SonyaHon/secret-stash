import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'files' })
export class MongooseFile {
  @Prop()
  path: string;

  @Prop()
  size: number;

  @Prop()
  mimetype: string;
}

export type FileDocument = Document & MongooseFile;
export const FileSchemaName = MongooseFile.name;
export const FileSchema = SchemaFactory.createForClass(MongooseFile);
