const article = require('../models/article');
const { functions, result } = require('lodash');
const Notification = require('../models/notification');
const User = require('../models/user');

module.exports.getAllNotifications = (email, callback) => {
    Notification.find({ email: email }, { _id: 0, email: 0, }).exec(function (error, notifications) {
        if (error)
            callback(error, null);
        else
            callback(error, notifications);
    })
}

module.exports.notifyAll = (users, notificationObject, callback) => {
    Notification.find({
        email: { $in: users }
    }, function (error, notifications) {
        if (error) {
            callback({
                message: "Couldnt find topic"
            }, null)
            return;
        } else {
            Notification.updateMany(
                { email: { $in: users } },
                { $push: { notification: notificationObject } }
            ).exec(
                function (error, result) {
                }
            )
            callback(error, notifications)
        }
    })

}
module.exports.notifyFollowers = (authorId, title) => {
    User.findOne({ _id: authorId }, 'followers name profilePic.url').exec(
        function (error, author) {
            const notificationObj = {
                "message": author.name + " published an article, " + title,
                "userProfilePic": author.profilePic.url,
                "hasSeen": false,
                "createdOn": new Date()
            }
            Notification.updateMany(
                { email: { $in: author.followers } },
                { $push: { notification: notificationObj } }
            ).exec(
                function (error, result) {
                }
            )
        }
    )
}

module.exports.deleteNotifications = (user, deleteNotifications, callback) => {
    Notification.find({
        email: user
    }, function (error, notifications) {
        if (error) {
            callback({
                message: "Couldnt find "
            }, null)
            return;
        } else {
            Notification.update(
                { email: user },
                { $pull:{notification: { _id: deleteNotifications } }}
            ).exec(
                function (error, result) {
                    callback(error, result)
                }
            )
         
        }
    })

}
