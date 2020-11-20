const User = require("../models/user");

module.exports.createUser = function (name, email, password, success) {
  var user = new User({ name, email, password });
  user.save(function (error, newUser) {
    success(error, newUser);
  });
};

module.exports.getUser = function (email, callback) {
  User.findOne({ email: email }, function (err, docs) {
    if (err) {
      callback(err, null);
    } else {
      callback(err, docs);
    }
  });
};

module.exports.getUserByCount = function (count, callback) {
  let projection = { articles: 0, topics: 0, follows: 0, password: 0, __v: 0 };
  if (count !== undefined) {
    User.find({}, projection, { limit: Number(count) }).
      exec(function (error, user) {
        callback(error, user);
      })
  } else {
    User.find({}, projection).
      exec(function (error, user) {
        callback(error, user);
      })
  }
}

module.exports.followAnUser = (userId, userEmail, success) => {
  User.findOne({ _id: userId }, function (error, existingUser) {
      if (error) {
          success({
              message: "Couldnt find user"
          }, null, null)
          return;
      }
      else {
          User.findOne({ email: userEmail }, function (error, user) {
              if (user) {
                  user.follows.push(userId);
                  user.save(function (error, user) {
                      success(error, user);
                  })
              } else {
                  success({
                      message: "Couldnt find user"
                  }, null, null)
                  return;
              }
          });

      }
  })

}

module.exports.unfollowAnUser = (userId, userEmail, success) => {
  User.findOne({ _id: userId }, function (error, exisitingUser) {
      if (error) {
          success({
              message: "Couldnt find User"
          }, null, null)
          return;
      }
      else {
          User.findOne({ email: userEmail }, function (error, user) {
              if (user) {
                  for (var i in user.follows) {
                      if (user.follows[i] == userId) {
                          user.follows.splice(i, 1);
                      }
                  }
                 
                  user.save(function (error, user) {
                      success(error, user);
                  })
              } else {
                  success({
                      message: "Couldnt find user"
                  }, null, null)
                  return;
              }
          });

      }
  })

}

module.exports.checkIfUserAlreadyIsFollowing = (userId, userEmail, callback) => {
  User.findOne({ email: userEmail }, function (error, user) {
      if (user) {
          var flag = 0
          for (var i in user.follows) {
              if (user.follows[i] == userId) {
                  flag = 1;
                  break;
              }
          } 
          if (flag == 0) {
              callback(null, user)
          } 
          else {
              callback(error, null)
          }

      } else {
          callback({
              message: "Couldnt find user"
          }, null, null)
          return;
      }
  });

}


