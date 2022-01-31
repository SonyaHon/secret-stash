import { createLogger, format, transports } from 'winston';

export const Logger = createLogger({
  defaultMeta: { service: 'secret-stash' },
  level: 'debug',
  format: format.combine(
    format.timestamp(),
    format.json(),
    format.prettyPrint(),
  ),
  transports: [new transports.Console()],
});
