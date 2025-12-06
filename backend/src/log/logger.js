import winston from 'winston'
import 'winston-daily-rotate-file'
import fs from 'fs'
import path from 'path'

const logDir = 'src/log/logs'
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

const { combine, timestamp, printf, colorize } = winston.format

const fileFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`
})

const consoleFormat = combine(
  colorize(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  printf(({ level, message, timestamp }) => `[${timestamp}] ${level}: ${message}`)
)

const combinedTransport = new winston.transports.DailyRotateFile({
  dirname: logDir,
  filename: 'Combined-%DATE%.log',
  datePattern: 'YYYY-WW',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '12w',
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), fileFormat)
})

const errorTransport = new winston.transports.DailyRotateFile({
  dirname: logDir,
  filename: 'Error-%DATE%.log',
  level: 'error',
  datePattern: 'YYYY-WW',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '12w',
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), fileFormat)
})

const logger = winston.createLogger({
  level: 'info',
  transports: [new winston.transports.Console({ format: consoleFormat }), combinedTransport, errorTransport]
})

export default logger
