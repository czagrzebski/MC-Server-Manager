const winston = require("winston");

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

//TODO: Create a new transport for a Daily Rotating File (Using Winston-Daily-Rotate)
const transports = [
  new winston.transports.Console(),
  new winston.transports.File({ 
    filename: "logs/latest.log",
    options: { flags: "w" }, //only stores latest log
  }),
];

//Format the log output
const format = winston.format.combine(
  winston.format.timestamp({ format: "HH:mm:ss" }),
  winston.format.printf(
    (info) =>
      `[${info.timestamp}] [${info.service || "Core"}/${info.level.toUpperCase()}]: ${info.message}`
  )
);

//Auto-detects log level based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development'
  const isDevelopment = env === 'development'
  return isDevelopment ? 'debug' : 'warn'
}

const logger = winston.createLogger({
  level: level(),
  levels,
  transports,
  format,
});

module.exports = {
  logger
};
