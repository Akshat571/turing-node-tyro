const notificationDao = require("../dao/notificationDao");
const article = require("../models/article");
const topicDao = require("../dao/topicDao");
const articleDao = require("../dao/articleDao")
const topic = require("../models/topic");
const { result } = require("lodash");

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

module.exports.saveTopicNotification = function (article, callback) {
    articleDao.getArticle(article._id, function (error, newArticle) {
        if (error) {
            callback(error, null)
        } else {
            topicDao.getTopics(article.topics, function (error, resultTopics) {
                if (error) {
                    callback(error, null)
                } else {
                    for (var i = 0; i < resultTopics.length; i++) {
                        console.log("result-->", resultTopics[i])
                        notifyUser(resultTopics[i], newArticle, function (error, result) {
                            if (error) {
                                callback(error, null)
                            }
                        })
                    }
                    callback(error, resultTopics)
                }

            })
        }
    })


}

const notifyUser = function (topic, article, callback) {
    const date = new Date();
    var notificationObj = {
        "message": "There is a new article in a topic that you follow, " + topic.topicName + " , " + article.title,
        "userProfilePic": article.author.profilePic.url,
        "hasSeen": false,
        "createdOn": date
    }
    console.log("user-->",topic.followers)
    notificationDao.notifyAll(topic.followers, notificationObj, function (error, notifications) {
        console.log("notification-->",notifications)
        callback(error, notifications)
    })
}