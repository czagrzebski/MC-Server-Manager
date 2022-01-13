const db = require("../config/db");
const logger = require("./logger").logger;
const crypto = require("crypto");

const tokenManager = {
  setup: () => {
    //Check if token secrets were provided
    if (!process.env.ACCESS_TOKEN_SECRET) {
      logger.error("Please Provide a Access Token Secret. See documentation for details.");
      process.exit();
    } else if (!process.env.REFRESH_TOKEN_SECRET) {
      logger.error("Please Provide a Refresh Token Secret. See documentation for details.");
      process.exit();
    }
  },
  generateTokens: () => {
    const accessToken = crypto.randomBytes(64).toString("hex");
    const refreshToken = crypto.randomBytes(64).toString("hex");

    console.log(`ACCESS_TOKEN_SECRET=${accessToken}`);
    console.log(`REFRESH_TOKEN_SECRET=${refreshToken}`);
  },
};

if (require.main === module) {
  tokenManager.generateTokens();
}

module.exports = {
  tokenManager,
};
