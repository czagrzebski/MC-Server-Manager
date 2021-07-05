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
 * GET - Fetch the minecraft server properties
 */
async function getServerProperties(req, res) {
    req.app.get('minecraftServer').readProperties()
        .then(response => res.json(response))
        .catch(err => res.status(500).send(err.message));
}

/**
 * POST - Updates the server properties
 */
async function updateServerProperties(req, res) {
    const properties = req.body;
    req.app.get('minecraftServer').writeProperties(properties)
        .then(response => res.json(response))
        .catch(err => res.status(500).send(err.message));
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
 * GET - Retrieve the server configuration
*/
async function getConfig(req, res) {
    req.app.get('minecraftServer').acceptEULA()
        .then(response => res.send(response))
        .catch(err => res.status(400).send(err.message));
}

/**
 * POST - Update the server configuration
*/
async function updateConfig(req, res) {
    req.app.get('minecraftServer').acceptEULA()
        .then(response => res.send(response))
        .catch(err => res.status(400).send(err.message));
}

module.exports = {
    startServer: startServer,
    stopServer: stopServer,
    getState: getState,
    killServer: killServer,
    sendCommand: sendCommand,
    getServerProperties: getServerProperties,
    updateServerProperties: updateServerProperties,
    acceptEULA: acceptEULA
}