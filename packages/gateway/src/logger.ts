import { Format } from 'logform';
import { createLogger, format, transports } from 'winston';

function buildLogger() {
  const isProduction = process.env.NODE_ENV === 'production';
  const loggingFormat = format.printf(
    ({ level, message, timestamp }) => `[${timestamp}] ${level}: ${message}`
  );

  const formats: Format[] = [
    format.splat(),
    format.timestamp({
      format: 'DD-MM-YYYY HH:mm:ss',
    }),
  ];

  if (!isProduction) {
    formats.push(format.colorize());
  }

  formats.push(loggingFormat);

  return createLogger({
    level: isProduction ? 'info' : 'debug',
    format: format.combine(...formats),
    transports: [new transports.Console()],
  });
}

export const logger = buildLogger();
