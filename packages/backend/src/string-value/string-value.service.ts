import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  StringValueDocument,
  StringValueSchemaName,
} from '../entities/string-value.entity';
import { Model } from 'mongoose';

@Injectable()
export class StringValueService {
  private readonly cache: Record<string, boolean> = {};
  constructor(
    @InjectModel(StringValueSchemaName)
    private readonly stringValueModel: Model<StringValueDocument>,
  ) {}

  private async checkCache(kind: string) {
    if (this.cache[kind]) return;
    await this.stringValueModel.insertMany([{ kind, values: [] }]);
    this.cache[kind] = true;
  }

  async insertValue(kind: string, value: string | string[]): Promise<void> {
    await this.checkCache(kind);

    const values = typeof value === 'string' ? [value] : value;
    await this.stringValueModel
      .findOneAndUpdate(
        { kind },
        {
          $addToSet: {
            values: {
              $each: values,
            },
          },
        },
      )
      .exec();
  }

  async removeValue(kind: string, value: string | string[]): Promise<void> {
    const values = typeof value === 'string' ? [value] : value;
    await this.stringValueModel
      .findOneAndUpdate({ kind }, { $pull: values })
      .exec();
  }

  async getValues(kind: string): Promise<string[]> {
    const valuesDoc = await this.stringValueModel.findOne({ kind });
    if (!valuesDoc) {
      throw new Error(`Kind ${kind} is not found`);
    }

    return valuesDoc.values;
  }
}
