const TopicDao = require("../dao/topicDao");

module.exports.getSimilarTopics = function (topic, callback) {
    TopicDao.findSimilarTopics(topic, function (error, result) {
        callback(error, result);
    })

}

module.exports.followTopic = function (topicId, userEmail, callback) {
    TopicDao.addTopicToPerson(topicId, userEmail, function (error, result) {
        callback(error, result)
    })
}