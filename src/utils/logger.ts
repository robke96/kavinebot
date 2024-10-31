import { createLogger, format, transports } from 'winston';

const consoleFormat = format.combine(
  format.colorize(), 
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);

const fileFormat = format.combine(
  format.uncolorize(), 
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.prettyPrint({ depth: 5 }),
  format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);

const logger = createLogger({
  level: 'info',
  transports: [
    new transports.Console({
      format: consoleFormat,
    }),
    new transports.File({
      filename: 'bot.log',
      level: 'info',
      format: fileFormat,
    }),
  ],
});

export default logger;
