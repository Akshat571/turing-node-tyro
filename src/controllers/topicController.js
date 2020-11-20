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

module.exports.retriveTopicsByCount = function (count, callback) {
    TopicDao.getTopicsByCount(count, function (error, topicArr) {
        if (error || topicArr.length === 0)
            callback(error, null);
        else
            callback(error, topicArr);
    })
}