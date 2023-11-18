import { WinstonModule, utilities } from 'nest-winston';
import * as winston from 'winston';
import * as daily from 'winston-daily-rotate-file';

/**
 * log rotate 설정을 위한 변수입니다.
 *
 * @param level 기록할 파일 형식 및 저장위치를 위한 로그 레벨
 * @returns DailyRotateFile.DailyRotateFileTransportOptions을 반환합니다.
 */
const dailyTransportOption = (level: string): daily.DailyRotateFileTransportOptions => {
  return {
    level,
    datePattern: 'YYYY-MM-DD',
    dirname: process.env.PWD + `/logs/${level}`,
    filename: `%DATE%.${level}.log`,
    maxFiles: 30,
    zippedArchive: true,
  };
};

/**
 * Log 설정을 위한 LoggerService 인스턴스입니다.
 */
export const customLogger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'prod' ? 'info' : 'silly',
      format:
        process.env.NODE_ENV === 'prod'
          ? winston.format.simple()
          : winston.format.combine(
              winston.format.colorize(),
              winston.format.timestamp(),
              utilities.format.nestLike('arabang', { prettyPrint: true }),
            ),
    }),

    new daily(dailyTransportOption('info')),
    new daily(dailyTransportOption('warn')),
    new daily(dailyTransportOption('error')),
  ],
});
