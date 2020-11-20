const Article = require('../models/article');
const topic = require('../models/topic');
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
                "result": {
                    message: "Couldnt find topic"
                }
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
                        result: {
                            message: "Couldnt find user"
                        }
                    }, null, null)
                    return;
                }
            });
        }
    })
}

module.exports.removeTopicFromPerson = (topicId, userEmail, success) => {
    Topic.findOne({ _id: topicId }, function (error, topic) {
        if (error) {
            success({
                "result": {
                    message: "Couldnt find topic"
                }
            }, null, null)
            return;
        }
        else {
            User.findOne({ email: userEmail }, function (error, user) {
                if (user) {
                    for (var i in user.topics) {
                        if (user.topics[i] == topicId) {
                            user.topics.splice(i, 1);
                        }
                    }
                    user.save(function (error, user) {
                        success(error, user);
                    })
                } else {
                    success({
                        "result": {
                            message: "Couldnt find topic"
                        }
                    }, null, null)
                    return;
                }
            });
        }
    })
}

module.exports.checkIfTopicAlreadyExists = (topicId, userEmail, callback) => {
    User.findOne({ email: userEmail }, function (error, user) {
        if (user) {
            var flag = 0
            for (var i in user.topics) {
                if (user.topics[i] == topicId) {
                    flag = 1;
                    break;
                }
            }
            if (flag == 0) {
                callback(null, user)
            }
            else {
                callback(error, null)
            }

        } else {
            callback({
                "result": {
                    message: "Couldnt find topic"
                }
            }, null, null)
            return;
        }
    });
}

module.exports.getTopicsByCount = function (count, callback) {
    if (count !== undefined) {
        Topic.find({}, { articles: 0, __v: 0 }, { limit: Number(count) }).
            exec(function (error, topicArr) {
                callback(error, topicArr);
            })
    } else {
        Topic.find({}, { articles: 0, __v: 0 }).
            exec(function (error, topicArr) {
                callback(error, topicArr);
            })
    }
}