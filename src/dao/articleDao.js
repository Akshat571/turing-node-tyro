const Article = require('../models/article');
const User = require('../models/user');
const Topic = require('../models/topic');


module.exports.createArticle = function (title, topics, content, authorId, success) {
    const date = new Date();
    var newArticle = new Article({
        author: authorId, title: title, content: content, topics: topics, view: 4, createdOn: date
    });
    newArticle.save(function (error, publishedPost) {
        User.findOne({ _id: authorId }, function (error, user) {
            if (user) {
                user.articles.push(publishedPost);
                user.save(function (error, user) {
                    success(error, publishedPost);
                })
            } else {
                success({
                    message: "Couldnt find user"
                }, null, null)
                return;
            }
        });
        Topic.find({ _id: { $in: topics } }, function (error, result) {
            if (result) {
                for (var i = 0; i < result.length; i++) {
                    console.log(result[i]);
                    result[i].articles.push(publishedPost);
                    result[i].save();
                }
            }
        })
    })
};

module.exports.getTrendingArticle = (callback) => {
    const options = { sort: { count: -1 }, limit: 4 };
    Article.find({}, { topics: 0, __v: 0, content: 0 }, options).
        populate('author', '_id name email').
        exec(function (error, articles) {
            if (error) {
                callback(error, null);
            } else {
                callback(error, articles);
            }
        })
}

module.exports.getFeed = (email, callback) => {
    User.findOne(
        {
            email: email
        },
        {
            _id: 0,
            __v: 0,
            name: 0,
            password: 0,
            email: 0,
            articles: 0
        },
        {}).
        populate({
            path: 'topics peopleFollowing', select: 'articles -_id',
            populate: {
                path: 'articles', select: 'title content createdOn _id',
            },
            options: { sort: { 'createdOn': -1 } }
        }).
        exec(function (error, feed) {
            if (error)
                callback(error, null);
            else
                callback(error, feed);
        })
}

