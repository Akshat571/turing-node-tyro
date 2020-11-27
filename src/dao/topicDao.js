const Topic = require('../models/topic');
const User = require('../models/user');
const { use } = require('../routes/topicsRoute');


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

module.exports.removeTopicFromPerson = (topicId, userEmail, success) => {
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

                        message: "Couldnt find topic"

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

                message: "Couldnt find topic"

            }, null, null)
            return;
        }
    });
}

module.exports.getTopicsByCount = function (count, callback) {
    if (count !== undefined) {
        Topic.find({}, { articles: 0, __v: 0 }, { limit: Number(count) }).lean().
            exec(function (error, topics) {
                callback(error, topics);
            })
    } else {
        Topic.find({}, { articles: 0, __v: 0 }).lean().
            exec(function (error, topics) {
                callback(error, topics);
            })
    }
}

module.exports.getUserTopics = (email, callback) => {
    console.log(email);
    User.findOne({ email: email }, 'topics -_id').
        exec(function (error, userTopics) {
            if (error || userTopics == null)
                callback(error, []);
            else
                callback(error, userTopics);
        });
}

module.exports.setArticleForTopics = function (topics, articleId, success) {
    Topic.find({
        _id: { $in: topics }}, function(error, result) {
            if (error) {
                success({
                    message: "Couldnt find topic"
                }, null, null)
                return;
            } else {
                for (var i = 0; i < result.length; i++) {
                    result[i].articles.push(articleId);
                    result[i].save();
                }
                success(error, result)
            }
        }
    )

}
