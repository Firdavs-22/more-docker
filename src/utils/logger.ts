import winston from 'winston';
import 'winston-daily-rotate-file';

const transports = [];

if (process.env.NODE_ENV !== 'test') {
    transports.push(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.DailyRotateFile({
            filename: 'application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            dirname: 'logs',
            maxFiles: '14d'
        })
    );
} else {
    transports.push(new winston.transports.Console({
        silent: true
    }));
}

const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports
});

export default logger;