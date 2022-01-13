//GET - Starts the Minecraft Server
async function startServer(req, res, next) {
  req.app
    .get("minecraftServer")
    .startServer()
    .then((response) => res.send(response))
    .catch((err) => {
      err.status = 400;
      next(err);
    });
}

//GET - Stops the Minecraft Server
async function stopServer(req, res, next) {
  req.app
    .get("minecraftServer")
    .stopServer()
    .then((response) => res.send(response))
    .catch((err) => {
      err.status = 400;
      next(err);
    });
}

//GET - Fetch the current state of the Server
async function getState(req, res, next) {
  req.app
    .get("minecraftServer")
    .getState()
    .then((response) => res.send(response))
    .catch((err) => {
      err.status = 400;
      next(err);
    });
}

//GET - Kills the Minecraft Server
async function killServer(req, res, next) {
  req.app
    .get("minecraftServer")
    .killServer()
    .then((response) => res.send(response))
    .catch((err) => {
      err.status = 400;
      next(err);
    });
}

//POST - Sends command to the minecraft server
async function sendCommand(req, res, next) {
  const { command } = req.body;
  req.app
    .get("minecraftServer")
    .sendCommand(command)
    .then((response) => res.send(response))
    .catch((err) => {
      err.status = 400;
      next(err);
    });
}

//PUT - Accepts the Mojang EULA
async function acceptEULA(req, res, next) {
  req.app
    .get("minecraftServer")
    .acceptEULA()
    .then((response) => res.send(response))
    .catch((err) => {
      err.status = 400;
      next(err);
    });
}

//GET - Fetch server settings
async function getServerSettings(req, res, next) {
  req.app
    .get("minecraftServer")
    .getServerSettings()
    .then((response) => res.send(response))
    .catch((err) => {
      err.status = 400;
      next(err);
    });
}

//POST - Set Server settings
async function setServerSetting(req, res, next) {
  const { category, setting, value } = req.body;
  req.app
    .get("minecraftServer")
    .setServerSetting(category, setting, value)
    .then((response) => res.send(response))
    .catch((err) => {
      err.status = 400;
      next(err);
    });
}

//GET - Download and Install Server Jar
async function installJar(req, res, next) {
  const { version } = req.body;
  req.app
    .get("minecraftServer")
    .downloadJar(version)
    .then((response) => res.send(response))
    .catch((err) => {
      err.status = 400;
      next(err);
    });
}

module.exports = {
  startServer,
  stopServer,
  getState,
  killServer,
  sendCommand,
  getServerSettings,
  setServerSetting,
  acceptEULA,
  installJar,
};
