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

module.exports.retriveUserByCount = function (count, userEmail, callback) {
  userDao.getUser(userEmail, function (error, currentUser) {
    if (error) {
      callback(error, null);
    } else {
      userDao.getUserByCount(count, function (error, users) {
        if (error || users.length === 0)
          callback(error, null);
        else {
          for (let i = 0; i < users.length; i++) {
            if (currentUser.peopleFollowing.includes(users[i]._id)) {
              users[i].isFollowing = true;
            } else {
              users[i].isFollowing = false;
            }
          }
          callback(error, users);
        }
      })

    }
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

module.exports.addProfilePic = function (email, imgUrl, public_id, callback) {
  userDao.updateProfilePic(email, imgUrl, public_id, function (error, docs) {
    if (error)
      callback(error, null);
    else
      callback(error, docs);
  })
}

module.exports.retriveProfilePic = function (email, callback) {
  userDao.getProfilePic(email, function (error, doc) {
    if (error) {
      callback(error, null);
    } else {
      callback(error, doc);
    }
  })
}
