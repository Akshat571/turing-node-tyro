const userDao = require("../dao/userDao");
const bcrypt = require("bcryptjs");
const { tokenGenerator } = require("../utils");

module.exports.registerUser = function (name, email, password, callback) {
  var password = bcrypt.hashSync(password, 10);
  userDao.createUser(name, email, password, function (error, user) {
    if (error) {
      callback(error, null);
      return;
    } else {
      var secret = "secret";
      tokenGenerator(name, email, secret, function (error, token) {
        if (error) {
          callback(error, null);
        } else {
          callback(error, token);
        }
      })
    }
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

module.exports.retriveUserByCount = function (count, callback) {
  userDao.getUserByCount(count, function (error, user) {
    if (error || user.length === 0)
      callback(error, null);
    else
      callback(error, user);
  })
} 
