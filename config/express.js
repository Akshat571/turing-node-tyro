const path = require("path");
const logger = require("morgan");
const express = require("express");
const cors = require('cors');
const bodyparser = require("body-parser");

const swaggerUi = require('swagger-ui-express');
swaggerDocument = require('../swagger.json');

// const swaggerOptions = {
//   definition: {
//     info: {
//       title: 'Project Tyro REST endpoints',
//       description: ' API Thedocumentation contains all the REST endpoints related to project Tyro.',
//       version: '1.0.0',
//       contact: {
//         name: "API support",
//         email: "akshatdivya@infrrd.ai, akshathajanardhan@infrrd.ai"
//       },
//       basePath: '/',
//       servers: ["http://localhost:3000"]
//     }
//   },
//   apis: ['E:/turing-node-tyro/src/routes/userRoute.js']
// }
module.exports = function (app) {
  app.use(logger("dev"));
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(bodyparser.json());
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
