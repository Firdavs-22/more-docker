import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const consoleFormat = winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ""}`;
});

const dailyRotateFileTransport = new DailyRotateFile({
    filename: "%DATE%.log",
    datePattern: "YYYYMMDD",
    maxSize: "20m",
    maxFiles: "14d",
    dirname: "logs",
    format: winston.format.combine(
        winston.format.timestamp(),
        consoleFormat,
    )
})


const logger = winston.createLogger({
    level: "debug",
    format: winston.format.timestamp(),
    transports: [
        new winston.transports.Console({
            format: consoleFormat
        }),
        dailyRotateFileTransport
    ]
})

export default logger;