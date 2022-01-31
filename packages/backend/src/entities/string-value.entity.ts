import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StringValueDocument = Document & MongooseStringValue;

@Schema({ collection: 'string-values' })
export class MongooseStringValue {
  @Prop()
  kind: string;

  @Prop([String])
  values: string[];
}

export const StringValueSchemaName = MongooseStringValue.name;

export const StringValueSchema =
  SchemaFactory.createForClass(MongooseStringValue);
