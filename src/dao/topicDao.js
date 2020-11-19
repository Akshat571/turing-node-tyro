const Article = require('../models/article');
const Topic = require('../models/topic');
const User = require('../models/user');

module.exports.findSimilarTopics = (topic, success) => {
    Topic.find({ "topicName": { $regex: '^' + topic, $options: "i" } }, { articles: 0, __v: 0, _v: 0 }).exec(function (error, result) {
        if (error || result.length < 1) {
            success({
                message: 'There is no topic with such name'
            }, null);
            return;
        } else {
            success(null, result)

        }
    })
}

module.exports.addTopicToPerson = (topicId, userEmail, success) => {
    Topic.findOne({ _id: topicId }, function (error, topic) {
        if (error) {
            success({
                message: "Couldnt find topic"
            }, null, null)
            return;
        }
        else {
            User.findOne({ email: userEmail }, function (error, user) {
                if (user) {
                    user.topics.push(topicId);
                    user.save(function (error, user) {
                        success(error, user);
                    })
                } else {
                    success({
                        message: "Couldnt find user"
                    }, null, null)
                    return;
                }
            });

        }
    })

}



