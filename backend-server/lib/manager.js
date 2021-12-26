const uuidv4 = require("uuid");
const fs = require("fs");
const path = require("path");
const logger = require("../lib/logger").logger;

const manager = {
  createServer: async () => {
    const uuid = uuidv4.v4();

    logger.info(`Creating Minecraft Server with UUID: ${uuid}`);

    const config = await manager.readConfig().then((userConfig) => {
      userConfig.servers[uuid] = {
        name: "A server",
        version: "1.16.5",
        jarFile: "server.jar",
        maxHeapSize: "2048",
      };

      return userConfig;
    });

    //Check if server directory already exists. If not, create one.
    if (!fs.existsSync(path.join(__dirname, `../servers/${uuid}`))) {
      logger.info("Creating Server Directory");
      fs.mkdirSync(path.join(__dirname, `../servers/${uuid}`));
    }

    await manager.writeConfig(config);

    return uuid;
  },

  readConfig: async () => {
    //Open Server Configuration File
    const serverConfigFile = await fs.promises.readFile(
      path.join(__dirname, `../config/user/config.json`)
    );

    //Convert Configuration file from JSON to a Javascript Object
    return JSON.parse(serverConfigFile);
  },

  writeConfig: async (config) => {
    fs.promises
      .writeFile(
        path.join(__dirname, `../config/user/config.json`),
        JSON.stringify(config)
      )
      .catch((err) => {
        console.error(err);
        throw new Error("Failed to save user configuration");
      });
  },

  getServerList: async () => {
    return manager.readConfig().then((config) => {
      return config.servers;
    });
  },
};

module.exports = {
  manager,
};
