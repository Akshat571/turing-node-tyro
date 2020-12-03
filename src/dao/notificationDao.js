const Notification = require('../models/notification');

module.exports.getAllNotifications = (email, callback) => {
    Notification.find({ email: email }, { _id: 0, email: 0, }).exec(function (error, notifications) {
        if (error)
            callback(error, null);
        else
            callback(error, notifications);
    })
}