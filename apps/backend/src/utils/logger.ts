import winston from 'winston';

const { combine, timestamp, printf, colorize, errors } = winston.format;

/**
 * Custom log format for clean, readable logs
 */
const logFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  
  if (stack) {
    msg += `\n${stack}`;
  }
  
  return msg;
});

/**
 * Winston logger instance
 * Replaces console.log for production-ready logging
 * 
 * @see https://github.com/winstonjs/winston
 */
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      format: process.env.NODE_ENV === 'development'
        ? combine(colorize(), logFormat)
        : logFormat,
    }),
  ],
});

/**
 * Stream for Morgan HTTP logger integration
 */
export const loggerStream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};


