const User = require("../models/user");

module.exports.createUser = function (name, email, password, success) {
  var user = new User({ name, email, password });
  user.save(function (error, newUser) {
    console.log("user created inside dao of register=>", newUser);
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
