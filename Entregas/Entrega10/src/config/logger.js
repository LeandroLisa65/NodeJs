import winston from 'winston'
import program from '../utils/commander.js'
import dotenv from 'dotenv'

const { mode } = program.opts()
console.log('mode del program')
console.log(mode)
dotenv.config({path: './.env'})
dotenv.config({
    path: mode === 'development' ? './.env.development': './.env.production' 
})

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warning: 'yellow',
        info: 'blue',
        http: 'green',
        debug: 'magenta'
    }
}

const devLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console(
            {
                level: "debug",
                format: winston.format.combine(
                    winston.format.colorize({colors: customLevelOptions.colors}),
                    winston.format.simple()
                )
            }
        ),
        new winston.transports.File({
            filename: './errors.log',
            level: 'error',
            format: winston.format.simple()
        })
    ]
})

const prodLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console(
            {
                level: "info",
                format: winston.format.combine(
                    winston.format.colorize({colors: customLevelOptions.colors}),
                    winston.format.simple()
                )
            }
        ),
        new winston.transports.File({
            filename: './errors.log',
            level: 'error',
            format: winston.format.simple()
        })
    ]
})

const addLogger = (req, res, next) => {
    switch (mode) {
        case 'production':
            req.logger = prodLogger
            break;
        case 'development':
            req.logger = devLogger
        default:
            break;
    }
    req.logger.http(`${req.method} in ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);
    next();
}

let logger = ''
logger = mode == 'production' ? prodLogger : devLogger
export { logger, addLogger }