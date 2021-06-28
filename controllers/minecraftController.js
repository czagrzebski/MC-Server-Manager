async function startServer(req, res) {
    req.app.get('minecraftServer').startServer()
        .then(response => res.send(response))
        .catch(err => res.status(400).send(err.message));
    
}

async function stopServer(req, res) {
    req.app.get('minecraftServer').stopServer()
        .then(response => res.send(response))
        .catch(err => res.status(400).send(err));
}

async function getState(req, res) {
    req.app.get('minecraftServer').getState()
        .then(response => res.send(response))
        .catch(err => res.status(400).send(err));
    
}

async function killServer(req, res) {
    req.app.get('minecraftServer').killServer()
        .then(response => res.send(response))
        .catch(err => res.status(400).send(err.message));
}

async function sendCommand(req, res) {
    const {command} = req.body;
    req.app.get('minecraftServer').sendCommand(command)
        .then(response => res.send(response))
        .catch(err => res.status(400).send(err));

}

async function getServerProperties(req, res) {
    req.app.get('minecraftServer').readProperties()
        .then(response => res.json(response))
        .catch(err => res.status(500).send(err.message));
}

async function updateServerProperties(req, res) {
    const properties = req.body;
    req.app.get('minecraftServer').writeProperties(properties)
        .then(response => res.json(response))
        .catch(err => res.status(500).send(err.message));
}

async function acceptEULA(req, res) {
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