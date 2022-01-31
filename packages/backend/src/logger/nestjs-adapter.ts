import { LoggerService } from '@nestjs/common';
import { Logger } from './logger';

export class LoggerNestJS implements LoggerService {
  log(message: any, ...optionalParams: any[]) {
    Logger.info(message, { info: optionalParams });
  }

  error(message: any, ...optionalParams: any[]) {
    Logger.error(message, { info: optionalParams });
  }

  warn(message: any, ...optionalParams: any[]) {
    Logger.warn(message, { info: optionalParams });
  }
}
