const Article = require('../models/article');
const User = require('../models/user');
const Notification = require('../models/notification');

module.exports.createArticle = function (title, topics, content, authorId, success) {
    const date = new Date();
    var newArticle = new Article({
        author: authorId, title: title, content: content, topics: topics, views: 0, createdOn: date
    });
    newArticle.save(function (error, publishedArticle) {
        success(error, publishedArticle)
    })
};

module.exports.getTrendingArticle = (callback) => {
    const options = { sort: { views: -1 }, limit: 4 };
    Article.find({}, { topics: 0, __v: 0, content: 0, peopleWhoLikedArticle: 0 }, options).
        populate('author', '_id name email profilePic').
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
                path: 'articles', select: 'title content createdOn _id author',
                "options": { "sort": { "createdOn": -1 } },
                populate: {
                    path: 'author', select: 'name profilePic.url -_id'
                }
            }
        }).
        exec(function (error, feed) {
            if (error)
                callback(error, null);
            else
                callback(error, feed);
        })
}

module.exports.increaseView = function (articleId, success) {
    Article.findOne({ _id: articleId }, function (error, article) {
        if (error) {
            success({
                message: "Couldnt find article"
            }, null, null)
            return;
        } else {
            article.views += 1;
            article.save(function (error, articleWithIncreasedView) {
                success(error, articleWithIncreasedView);
            })
        }
    })
}


module.exports.likeArticle = function (userId, articleId, userEmail, success) {
    Article.findOne({ _id: articleId }, function (error, article) {
        if (error) {
            success({
                message: "Couldnt find article"
            }, null, null)
            return;
        } else {
            article.peopleWhoLikedArticle.push(userId);
            article.noOfLikes = article.peopleWhoLikedArticle.length;
            article.save(function (error, newArticle) {
                success(error, newArticle);
            })
        }
    })
    User.findOne({ email: userEmail }).exec(function (error, likedUser) {
        Article.findOne({ _id: articleId },
            {
                topics: 0,
                peopleWhoLikedArticle: 0,
                _id: 0,
                content: 0,
                views: 0,
                createdOn: 0,
                __v: 0,
                noOfLikes: 0
            })
            .populate({
                path: 'author', select: 'name email profilePic.url -_id'
            }).exec(function (error, likedArticleAuthor) {
                var notificationObj = {
                    "message": likedUser.name + " liked your article, " + likedArticleAuthor.title,
                    "userProfilePic": likedArticleAuthor.author.profilePic.url,
                    "hasSeen": false
                }
                Notification.updateOne({
                    email: likedArticleAuthor.author.email
                },
                    {
                        $push: {
                            notification: notificationObj
                        }
                    })
                    .exec(function (error, result) {
                    })
            })
    })

}

module.exports.unlikeArticle = (articleId, userId, success) => {
    Article.findOne({ _id: articleId }, function (error, article) {
        if (article) {
            for (var i in article.peopleWhoLikedArticle) {
                if (article.peopleWhoLikedArticle[i].equals(userId)) {
                    article.peopleWhoLikedArticle.splice(i, 1);
                }
            }
            article.noOfLikes = article.peopleWhoLikedArticle.length;
            article.save(function (error, article) {
                success(error, article);
            })
        } else {
            success({
                message: "Couldnt find article"
            }, null, null)
            return;
        }
    });


}
module.exports.getArticle = function (articleId, callback) {
    Article.findOne({ _id: articleId }, { __v: 0, views: 0, topics: 0 }).populate({
        path: 'author', select: 'name email _id profilePic'
    }).lean().exec(function (error, article) {
        if (error) {
            callback({
                message: "Couldnt find article"
            }, null)
        } else {
            callback(error, article)
        }

    })
}
