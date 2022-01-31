import { BootstrapModule } from './bootstrap/bootstrap.module';
import { Logger } from './logger/logger';

(async () => {
  await BootstrapModule.Initialize();
})().catch((error) => {
  if (error instanceof Error) {
    Logger.error('Unhandled error:', {
      error: { message: error.message, stack: error.stack },
    });
  } else {
    Logger.error('Unhandled error:', { error: { message: error } });
  }
});
