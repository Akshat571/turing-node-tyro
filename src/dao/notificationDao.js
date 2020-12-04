const article = require('../models/article');
const Notification = require('../models/notification');

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
        }else{
            for(var i=0;i<notifications.length;i++){
                notifications[i].notification.push(notificationObject)
                notifications[i].save();
                console.log("dao-->",notifications[i])
            }
            callback(error,notifications)
        }
    })

}