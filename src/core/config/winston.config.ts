import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
export const winstonConfig = {
  transports: [
    ...(process.env.ENABLE_LOGGING === 'true'
      ? [
          // Daily rotating file transport
          new DailyRotateFile({
            filename: 'logs/application-%DATE%.log', // Ensure logs are stored in the logs folder
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m', // Maximum file size
            maxFiles: '7d', // Retain logs for 14 days
          }),
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.ms(),
              nestWinstonModuleUtilities.format.nestLike('MyApp', {
                colors: true,
                prettyPrint: true,
                processId: true,
                appName: true,
              }),
            ),
          }),
          // File transport for error logs
          new DailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'error', // Log only errors
            maxSize: '10m', // Maximum file size per error log file
            maxFiles: '4d', // Keep error logs for 30 days
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.json(), // Structured JSON for error logs
            ),
          }),
        ]
      : [
          new winston.transports.Console({
            format: winston.format.simple(),
          }), // Fallback transport
        ]),
  ],
  level:
    process.env.NODE_ENV === 'production'
      ? process.env.ENABLE_LOGGING === 'true'
        ? 'warn'
        : 'silent'
      : process.env.ENABLE_LOGGING === 'true'
        ? 'debug'
        : 'silent',
};
