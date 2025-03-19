import winston from 'winston';
import 'winston-daily-rotate-file';

const customFormat = winston.format.printf((args) => {
    const { level, message, timestamp, ...meta } = args
    return `[${timestamp}] ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
});

const transports = [];

transports.push(
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.timestamp({
                format: 'YYYYMMDD-HHmmss'
            }),
            customFormat
        )
    })
);
if (process.env.NODE_ENV !== 'test') {
    transports.push(
        new winston.transports.DailyRotateFile({
            filename: '%DATE%.log',
            datePattern: 'YYYYMMDD',
            dirname: 'logs',
            maxFiles: '14d'
        })
    );
}

// transports.push(new winston.transports.Console({
//     silent: true
// }));
//

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYYMMDD-HHmmss'
        }),
        customFormat
    ),
    transports
});

export default logger;