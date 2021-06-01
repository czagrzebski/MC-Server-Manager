const express = require('express');

function getMCRoutes() {
    const router = express.Router()
    
    router.get('/start', startServer);
    router.get('/kill', killServer);
    router.get('/command', sendCommand);
    router.get('/state', getState);

    return router;
}

async function startServer(req, res) {
    req.app.get('minecraftServer').startServer()
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
    req.app.get('minecraftServer').sendCommand(command)
        .then(response => res.send(response))
        .catch(err => res.status(400).send(err));

}

module.exports = {
    getMCRoutes: getMCRoutes
}