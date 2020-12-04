const topicDao = require("../dao/topicDao");
const userDao = require("../dao/userDao")

module.exports.getSimilarTopics = function (topic, callback) {
    topicDao.findSimilarTopics(topic, function (error, result) {
        callback(error, result);
    })
}

module.exports.followTopic = function (topicId, userEmail, callback) {
    topicDao.getTopic(topicId, function (error, topic) {
        if (error) {
            callback(error, null)
        } else {
            userDao.getUser(userEmail, function (error, user) {
                if (error) {
                    callback(error, null)
                } else {
                    if (checkFollowStatus(user.topics, topicId)) {
                        callback(error, null)
                    } else {
                        userDao.addTopic(userEmail, topicId, function (error, user) {
                            if (user) {
                                topicDao.addUser(topicId, userEmail, function (error, topic) {
                                    callback(error, user)
                                })
                            } else {
                                callback(error, user)
                            }
                        })
                    }
                }
            })

        }
    })
}

const checkFollowStatus = function (topics, topicId) {
    return topics.includes(topicId);
}

module.exports.unfollowTopic = function (topicId, userEmail, callback) {
    userDao.removeTopic(userEmail, topicId, function (error, result) {
        callback(error, result)
    })
}

module.exports.retriveTopicsByCount = function (count, email, callback) {
    topicDao.getTopicsByCount(count, function (error, topics) {
        if (error)
            callback(error, null);
        else {
            topicDao.getUserTopics(email, function (error, userTopics) {
                if (error)
                    callback(error, null);
                else {
                    for (let i = 0; i < topics.length; i++) {
                        if (userTopics.topics.includes(topics[i]._id)) {
                            topics[i].isFollowing = true;
                        } else {
                            topics[i].isFollowing = false;
                        }
                    }
                    callback(error, topics);
                }
            });
        }
    })
}