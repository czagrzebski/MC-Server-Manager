const express = require('express');
const {startServer, stopServer, getState, killServer, sendCommand, getServerSettings, setServerSetting, acceptEULA, installJar} = require('../controllers/minecraftController');

function getMCRoutes() {
    const router = express.Router()
    
    router.get('/start', startServer);
    router.get('/stop', stopServer);
    router.get('/kill', killServer);
    router.get('/state', getState);
    router.post('/command', sendCommand);
    router.get('/settings', getServerSettings);
    router.put('/settings/set', setServerSetting);
    router.put('/accepteula', acceptEULA)
    router.get('/install', installJar)
    
    return router;
}

module.exports = {
    getMCRoutes: getMCRoutes
}