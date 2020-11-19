const Article = require('../models/article');
const Topic = require('../models/topic');

module.exports.findSimilarTopics = (topic, success) => {
    Topic.find({ "topicName": { $regex: '^'+topic, $options: "i" } },{articles: 0, __v: 0, _v: 0 }).exec(function (error, result) {
        if (error||result.length<1) {
            success({
                message: 'There is no topic with such name'
            }, null);
            return;
        } else {
            success(null,result)

        }
    })
}



