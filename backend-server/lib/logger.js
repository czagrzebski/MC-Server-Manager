const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: "logs/latest.log",
    options: { flags: "w" }, //only stores latest log
  }),
  new DailyRotateFile({
    filename: "logs/MCSM-%DATE%.log",
    datePattern: "YYYY-MM-DD-HH",
    zippedArchive: true,
    maxSize: "20m", //Max file size is 20mb
    maxFiles: "7d", //Deletes log files that are older than a week
  }),
];

const exceptionHandlers = [
  new winston.transports.File({
    filename: "logs/exceptions.log",
  }),
];

//Format the log output
const format = winston.format.combine(
  winston.format.timestamp({ format: "HH:mm:ss" }),
  winston.format.printf(
    (info) =>
      `[${info.timestamp}] [${
        info.service || "Core" //TODO: Separate application into manageable "services"
      }/${info.level.toUpperCase()}]: ${info.message}`
  )
);

//Auto-detects log level based on environment
const level = () => {
  const env = process.env.NODE_ENV || "development";
  const isDevelopment = env === "development";
  return isDevelopment ? "debug" : "warn";
};

const logger = winston.createLogger({
  level: level(),
  levels,
  transports,
  format,
  exceptionHandlers, //Stores any uncaught exceptions into a log file
});

module.exports = {
  logger,
};
