const express = require('express');
const {startServer, stopServer, getState, killServer, sendCommand, getServerProperties, updateServerProperties} = require('../controllers/minecraftController');

function getMCRoutes() {
    const router = express.Router()
    
    router.get('/start', startServer);
    router.get('/stop', stopServer);
    router.get('/kill', killServer);
    router.get('/state', getState);
    router.post('/command', sendCommand);
    router.get('/properties', getServerProperties);
    router.post('/update/properties', updateServerProperties);
    
    return router;
}

module.exports = {
    getMCRoutes: getMCRoutes
}