const notificationDao = require("../dao/notificationDao");

module.exports.retriveAllNotifications = (email, callback) => {
    notificationDao.getAllNotifications(email, function (error, notifications) {
        if (error)
            callback(error, null);
        else {
            newNotifications = notifications[0].notification;
            callback(error, newNotifications);
        }
    })
}