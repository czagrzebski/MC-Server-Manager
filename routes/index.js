const express = require('express');

const { getMCRoutes } = require('./minecraft');

function getRoutes() {
    const router = express.Router()

    router.use('/server', getMCRoutes())

    return router;
} 

module.exports = {getRoutes: getRoutes}