const express = require('express');
const db = require('./config/db');
const startExpressConfig = require('./config/express');
const startRoutesConfig = require('./config/routes');

const app = express();

db.start(function () {
    startExpressConfig(app);
    startRoutesConfig(app);
});


module.exports = app;