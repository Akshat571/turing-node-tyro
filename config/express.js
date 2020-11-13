const path = require("path");
const logger = require("morgan");
const express = require("express");
const cors = require('cors');
const bodyparser = require("body-parser");

module.exports = function (app) {
  app.use(logger("dev"));
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(bodyparser.json());
};
