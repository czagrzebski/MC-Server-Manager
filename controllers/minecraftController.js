async function startServer(req, res) {
    req.app.get('minecraftServer').startServer()
        .then(response => res.send(response))
        .catch(err => res.status(500).send(err));
    
}

async function stopServer(req, res) {
    req.app.get('minecraftServer').stopServer()
        .then(response => res.send(response))
        .catch(err => res.status(500).send(err));
}

async function getState(req, res) {
    req.app.get('minecraftServer').getState()
        .then(response => res.send(response))
        .catch(err => res.status(500).send(err));
    
}

async function killServer(req, res) {
    req.app.get('minecraftServer').killServer()
        .then(response => res.send(response))
        .catch(err => res.status(400).send(err));
}

async function sendCommand(req, res) {
    const {command} = req.body;
    req.app.get('minecraftServer').sendCommand(command)
        .then(response => res.send(response))
        .catch(err => res.status(400).send(err));

}

module.exports = {
    startServer: startServer,
    stopServer: stopServer,
    getState: getState,
    killServer: killServer,
    sendCommand: sendCommand
}