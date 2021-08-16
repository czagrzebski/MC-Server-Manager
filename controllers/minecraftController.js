/**
 * GET - Starts the Minecraft Server
 */
async function startServer(req, res) {
    req.app.get('minecraftServer').startServer()
        .then(response => res.send(response))
        .catch(err => res.status(400).send(err.message));
}

/**
 * GET - Stops the Minecraft Server
 */
async function stopServer(req, res) {
    req.app.get('minecraftServer').stopServer()
        .then(response => res.send(response))
        .catch(err => res.status(400).send(err));
}

/**
 * GET - Fetch the current state of the Server
 */
async function getState(req, res) {
    req.app.get('minecraftServer').getState()
        .then(response => res.send(response))
        .catch(err => res.status(400).send(err));  
}

/**
 * GET - Kills the Minecraft Server
 */
async function killServer(req, res) {
    req.app.get('minecraftServer').killServer()
        .then(response => res.send(response))
        .catch(err => res.status(400).send(err.message));
}

/**
 * POST - Sends command to the minecraft server
 */
async function sendCommand(req, res) {
    const {command} = req.body;
    req.app.get('minecraftServer').sendCommand(command)
        .then(response => res.send(response))
        .catch(err => res.status(400).send(err));
}


/**
 * GET - Accepts the Mojang EULA
*/
async function acceptEULA(req, res) {
    req.app.get('minecraftServer').acceptEULA()
        .then(response => res.send(response))
        .catch(err => res.status(400).send(err.message));
}

/**
 * GET - Fetch server settings
*/
async function getServerSettings(req, res) {
    req.app.get('minecraftServer').getServerSettings()
        .then(response => res.send(response))
        .catch(err => res.status(400).send(err.message));
}

/**
 * GET - Set Server settings
*/
async function setServerSetting(req, res) {
    const {category, setting, value} = req.body;
    req.app.get('minecraftServer').setServerSetting(category, setting, value)
        .then(response => res.send(response))
        .catch(err => res.status(400).send(err.message));
}


module.exports = {
    startServer: startServer,
    stopServer: stopServer,
    getState: getState,
    killServer: killServer,
    sendCommand: sendCommand,
    getServerSettings: getServerSettings,
    setServerSetting: setServerSetting,
    acceptEULA: acceptEULA
}