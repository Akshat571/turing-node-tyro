const Article = require('../models/article');
const User = require('../models/user');
const Topic = require('../models/topic');


module.exports.createArticle = function (title, topics, content, authorId, success) {
    const date = new Date();
    var newArticle = new Article({
        author: authorId, title: title, content: content, topics: topics, views: 0, createdOn: date
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

module.exports.bookMarkArticle = function (userEmail, articleId, success) {
    Article.findOne({ _id: articleId }, function (error, article) {
        if (error) {
            success({
                message: "Couldnt find Article"
            }, null, null)
            return;
        } else {
            User.findOne({ email: userEmail }, function (error, user) {
                if (error) {
                    success({
                        message: "Couldnt find user"
                    }, null, null)
                    return;
                } else {
                    user.articlesBookmarked.push(articleId);
                    user.save(function (error, newUser) {
                        success(error, newUser);
                    })

                }
            })

        }
    })
}

module.exports.checkIfArticleIsAlreadyBookmarked = (articleId, userEmail, callback) => {
    User.findOne({ email: userEmail }, function (error, user) {
        if (user) {
            var flag = 0
            for (var i in user.articlesBookmarked) {
                if (user.articlesBookmarked[i] == articleId) {
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
                    message: "Couldnt find user"

            }, null, null)
            return;
        }
    });
}

module.exports.removeBookmark = (articleId, userEmail, success) => {
    Article.findOne({ _id: articleId }, function (error, topic) {
        if (error) {
            success({
                    message: "Couldnt find article"
            }, null, null)
            return;
        }
        else {
            User.findOne({ email: userEmail }, function (error, user) {
                if (user) {
                    for (var i in user.articlesBookmarked) {
                        if (user.articlesBookmarked[i] == articleId) {
                            user.articlesBookmarked.splice(i, 1);
                        }
                    }
                    user.save(function (error, user) {
                        success(error, user);
                    })
                } else {
                    success({
                        "result": {
                            message: "Couldnt find article"
                        }
                    }, null, null)
                    return;
                }
            });
        }
    })
}

module.exports.checkIfArticleIsAlreadyLiked = (articleId, userId, callback) => {
    Article.findOne({ _id: articleId }, function (error, article) {
        if (article) {
            var flag = 0
            for (var i in article.peopleWhoLikedArticle) {
                if (article.peopleWhoLikedArticle[i].equals(userId)) {
                    flag = 1;
                    break;
                }
            }
            if (flag == 0) {
                callback(null, article)
            }
            else {
                callback(error, null)
            }
        } else {
            callback({

                message: "Couldnt find article"

            }, null, null)
            return;
        }
    });
}

module.exports.likeArticle = function (userId, articleId, success) {
    User.findOne({ _id: userId }, function (error, user) {
        if (error) {
            success({
                message: "Couldnt find User"
            }, null, null)
            return;
        } else {
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

        }
    })
}

module.exports.unlikeArticle = (articleId, userId, success) => {
    User.findOne({ _id: userId }, function (error, user) {
        if (error) {
            success({
                message: "Couldnt find user"
            }, null, null)
            return;
        }
        else {
            Article.findOne({ _id: articleId }, function (error, article) {
                if (article) {
                    for (var i in article.peopleWhoLikedArticle) {
                        if (article.peopleWhoLikedArticle[i].equals(userId)) {
                            article.peopleWhoLikedArticle.splice(i, 1);
                        }
                    }
                    article.noOfLikes=article.peopleWhoLikedArticle.length;
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
    })
}
