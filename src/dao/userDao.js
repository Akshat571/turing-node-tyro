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


