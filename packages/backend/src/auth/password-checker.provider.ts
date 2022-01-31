import { Injectable } from '@nestjs/common';
import { InjectConfig } from '@sonyahon/config';
import { compare } from 'bcryptjs';
import { AppConfig } from '../config/app.config';

@Injectable()
export class CredentialsChecker {
  constructor(
    @InjectConfig(AppConfig)
    private readonly config: AppConfig,
  ) {}

  async check({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<boolean> {
    return (
      username === this.config.username &&
      (await compare(password, this.config.password))
    );
  }
}
