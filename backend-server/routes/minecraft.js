const express = require('express');
const {startServer, stopServer, getState, killServer, sendCommand, getServerSettings, setServerSetting, acceptEULA, installJar} = require('../controllers/minecraftController');


const router = express.Router()

//GET - Request to start Minecraft server
router.get('/start', startServer);

//GET - Request to stop Minecraft server
router.get('/stop', stopServer);

//GET - Request to kill Minecraft server
router.get('/kill', killServer);

//GET - Request to retrieve the current Minecraft server state
router.get('/state', getState);

//POST - Request to send command to Minecraft server
router.post('/command', sendCommand);

//GET - Requests for retrieving server/instance settings
router.get('/settings', getServerSettings);

//PUT - Request for changing server/instance setting
router.put('/settings/set', setServerSetting);

//PUT - Request for accepting Mojang EULA for the server/instance
router.put('/accepteula', acceptEULA)

//GET - Request for downloading and installing minecraft server
router.get('/install', installJar)
    
module.exports = router;