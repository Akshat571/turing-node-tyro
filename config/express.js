const path = require("path");
const logger = require("morgan");
const express = require("express");
const cors = require('cors');
const bodyparser = require("body-parser");

const swaggerUi = require('swagger-ui-express');
swaggerDocument = require('../swagger.json');

module.exports = function (app) {
  app.use(logger("dev"));
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(bodyparser.json());
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
