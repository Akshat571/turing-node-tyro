const userDao = require("../dao/userDao");
const User = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { tokenGenerator } = require("../utils");

module.exports.registerUser = function (name, email, password, callback) {
  var password = bcrypt.hashSync(password, 10);
  userDao.createUser(name, email, password, function (error, user) {
    if (error) {
      callback("Mail exisits", null);
      return;
    } else {
      var secret="secret";
      var token =tokenGenerator(name,email,secret);
    }
    callback(error, user, token);
  });
};

module.exports.retriveUser = function (email, callback) {
  userDao.getUser(email.email, function (error, docs) {
    if (error || docs == null) {
      callback(error, null);
    } else {
      callback(error, docs);
    }
  });
};
