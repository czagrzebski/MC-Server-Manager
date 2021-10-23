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

const logger = winston.createLogger({
  level: "debug", //TODO: auto detect for dev/prod
  levels,
  transports,
});

module.exports = {
  logger,
};
