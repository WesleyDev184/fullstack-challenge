import { Injectable, LoggerService } from "@nestjs/common";
import * as winston from "winston";

// 1. Defina um objeto para as cores ANSI
const colors: Record<string, string> = {
  error: "\x1b[31m", // vermelho
  warn: "\x1b[33m", // amarelo
  info: "\x1b[32m", // verde
  debug: "\x1b[34m", // azul
  verbose: "\x1b[36m", // ciano
  distinctive: "\x1b[93m",
  reset: "\x1b[0m", // reseta a cor
};

@Injectable()
export class CustomLoggerService implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp({ format: "DD/MM/YYYY, HH:mm:ss" }),
        winston.format.errors({ stack: true }),
        winston.format.splat()
      ),
      // TODO: Adicionar arquivo de log como transporte
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.printf(({ level, message, timestamp }) => {
              const color = colors[level] || colors.reset;

              return `${color}[LOGGER]${colors.reset} - ${timestamp} - ${colors.distinctive} [${level === "info" ? "LOG" : level.toUpperCase()}]${colors.reset}${color} ${message}${colors.reset}:`;
            })
          ),
        }),
      ],
    });
  }

  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]) {
    this.logger.info(message, ...optionalParams);
  }

  /**
   * Write a 'fatal' level log.
   */
  fatal(message: any, ...optionalParams: any[]) {
    this.logger.error(message, ...optionalParams);
  }

  /**
   * Write an 'error' level log.
   */
  error(message: any, ...optionalParams: any[]) {
    this.logger.error(message, ...optionalParams);
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn(message, ...optionalParams);
  }

  /**
   * Write a 'debug' level log.
   */
  debug(message: any, ...optionalParams: any[]) {
    this.logger.debug(message, ...optionalParams);
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose(message: any, ...optionalParams: any[]) {
    // 💡 Lembrete: Corrija isso de .debug para .verbose
    this.logger.verbose(message, ...optionalParams);
  }
}
