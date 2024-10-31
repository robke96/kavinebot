import chalk from 'chalk';
import { createLogger, format, transports } from "winston";

const customFormat = format.printf(({ timestamp, level, message }) => {
    let colorizedLevel;

    switch (level) {
        case "error":
          colorizedLevel = chalk.red(level.toUpperCase());
          break;
        case "warn":
          colorizedLevel = chalk.yellow(level.toUpperCase());
          break;
        case "info":
          colorizedLevel = chalk.green(level.toUpperCase());
          break;
        case "debug":
          colorizedLevel = chalk.blue(level.toUpperCase());
          break;
        default:
          colorizedLevel = level.toUpperCase();
    }
  
    return `${chalk.gray(`[${timestamp}]`)} ${colorizedLevel}: ${message}`;
})

const logger = createLogger({
    level: "info",
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        customFormat
      ),
      transports: [
        new transports.Console({
          format: format.colorize(),
        }),
        new transports.File({
          filename: "bot.log",
          level: "info",
          format: format.json(),
        }),
      ],
})

export default logger;