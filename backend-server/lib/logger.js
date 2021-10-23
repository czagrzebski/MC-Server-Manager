const winston = require("winston");

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
];

const format = winston.format.combine(
  winston.format.timestamp({ format: "HH:mm:ss" }),
  winston.format.printf(
    (info) =>
      `[${info.timestamp}] [${info.service || "Core"}/${info.level.toUpperCase()}]: ${info.message}`
  )
);

const logger = winston.createLogger({
  level: "debug", //TODO: auto detect for dev/prod
  levels,
  transports,
  format,
});

module.exports = {
  logger,
};
