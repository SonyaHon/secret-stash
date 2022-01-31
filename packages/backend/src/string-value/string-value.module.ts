import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  StringValueSchema,
  StringValueSchemaName,
} from '../entities/string-value.entity';
import { StringValueService } from './string-value.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: StringValueSchemaName,
        schema: StringValueSchema,
      },
    ]),
  ],
  providers: [StringValueService],
  exports: [StringValueService],
})
export class StringValueModule {}
