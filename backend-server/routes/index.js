const express = require('express');

const { getMCRoutes } = require('./minecraft');

function getRoutes() {
    const router = express.Router()

    // MINECRAFT SERVER ROUTES //
    router.use('/', getMCRoutes())

    return router;
} 

module.exports = {getRoutes: getRoutes}