const TopicDao = require("../dao/topicDao");

module.exports.getSimilarTopics = function (topic, callback) {
    TopicDao.findSimilarTopics(topic, function (error, result) {
        callback(error, result);
    })
}

module.exports.followTopic = function (topicId, userEmail, callback) {
    TopicDao.checkIfTopicAlreadyExists(topicId, userEmail, function (error, result) {
        if (result == null) {
            callback(error, null);
        }
        else {
            TopicDao.addTopicToPerson(topicId, userEmail, function (error, result) {
                callback(error, result)
            })
        }
    })
}

module.exports.unfollowTopic = function (topicId, userEmail, callback) {
    TopicDao.removeTopicFromPerson(topicId, userEmail, function (error, result) {
        callback(error, result)
    })
}

module.exports.retriveTopicsByCount = function (count, email, callback) {
    TopicDao.getTopicsByCount(count, function (error, topics) {
        if (error)
            callback(error, null);
        else {
            TopicDao.getUserTopics(email, function (error, userTopics) {
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