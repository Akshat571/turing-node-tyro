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

module.exports.followUser = function (userId, userEmail, callback) {
  userDao.checkIfUserAlreadyIsFollowing(userId, userEmail, function (error, result) {
      if (result == null) {

          callback(error, null);
      }
      else {
          userDao.followAnUser(userId, userEmail, function (error, result) {
              callback(error, result)
          })
      }
  })
}

module.exports.unfollowUser = function (userId, userEmail, callback) {
  userDao.unfollowAnUser(userId, userEmail, function (error, result) {
      callback(error, result)
  })
}
