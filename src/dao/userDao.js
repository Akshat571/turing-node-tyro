const { findOne } = require('../models/user');
const User = require('../models/user');

module.exports.createUser = function (name, email, password, success) {
    var user = new User({ name, email, password });
    user.save(function (error, newUser) {
        success(error, newUser)
    });

}

