const articleDao = require("../dao/articleDao");
const userDao = require("../dao/userDao");

module.exports.publishPost = function (title, topics, content, author, callback) {
    userDao.getUser(author, function (error, user) {
        if (error) {
            callback(error, null);
        } else {
            const authorId = user._id;
            articleDao.createArticle(title, topics, content, authorId, function (error, newArticle) {
                if (error) {
                    callback(error, null);
                } else {
                    callback(error, newArticle);
                }
            })
        }
    })
}

module.exports.retriveTrendingArticles = (callback) => {
    articleDao.getTrendingArticle(function (error, docs) {
        if (error || docs == null)
            callback(error, null);
        else
            callback(error, docs);
    })
}

module.exports.retriveFeed = function (email, callback) {
    articleDao.getFeed(email, function (error, feeds) {
        if (error)
            callback(error, null);
        else {
            let ObjectIdset = new Set();
            let articles = [];
            let uniqueArticles = [];
            feeds.topics.map(obj => {
                articles = [...articles, ...obj.articles];
            })
            feeds.peopleFollowing.map(obj => {
                articles = [...articles, ...obj.articles];
            })
            for (let i = 0; i < articles.length; i++) {
                if (!ObjectIdset.has(String(articles[i]._id))) {
                    ObjectIdset.add(String(articles[i]._id));
                    uniqueArticles.push(articles[i]);
                }
            }
            callback(error, uniqueArticles);
        }
    })
}

module.exports.viewArticle = function (articleId, callback) {
    articleDao.increaseView(articleId, function (error, newArticle) {
        if (error) {
            callback(error, null);
        } else {
            callback(error, newArticle);
        }
    })
}

module.exports.bookMarkAnArticle = function (userEmail, articleId, callback) {
    articleDao.checkIfArticleIsAlreadyBookmarked(articleId, userEmail, function (error, result) {
        if (result == null) {
            callback(error, null);
        }
        else {
            articleDao.bookMarkArticle(userEmail, articleId, function (error, user) {
                callback(error, user);
            })

        }
    })

}

module.exports.removeBookmark = function (userEmail, articleId, callback) {
    articleDao.removeBookmark(articleId, userEmail, function (error, result) {
        callback(error, result)
    })
}

module.exports.likeArticle = function (userEmail, articleId, callback) {
    userDao.getUser(userEmail, function (error, user) {
        if (error) {
            callback(error, null);
        } else {
            const userId = user._id;
            articleDao.checkIfArticleIsAlreadyLiked(articleId, userId, function (error, result) {
                if (result == null) {
                    callback(error, null);
                }
                else {
                    articleDao.likeArticle(userId, articleId, function (error, user) {
                        callback(error, user);
                    })
                }
            })
        }
    })
}

module.exports.unlikeArticle = function (userEmail, articleId, callback) {
    userDao.getUser(userEmail, function (error, user) {
        if (error) {
            callback(error, null);
        } else {
            const userId = user._id;
            articleDao.unlikeArticle(articleId, userId, function (error, result) {
                callback(error, result)
            })

        }
    })

}

module.exports.retriveAllBookmarkedArticles = function (email, callback) {
    articleDao.getAllBookmarkedArticle(email, function (error, bookmarkedArticles) {
        if (error || bookmarkedArticles.length == 0)
            callback(error, null);
        else {
            let articles=bookmarkedArticles.bookmarkedArticles;
            callback(null, articles)
        }
    })
}

module.exports.readArticle = function (userEmail, articleId, callback) {

    userDao.getUser(userEmail, function (error, user) {
        if (error) {
            callback(error, null);
        } else {
            articleDao.getArticle(articleId, function (error, article) {
                if (error) {
                    callback(error, null);
                } else {
                    console.log(article);
                    article.hasLiked = false;
                    for (i = 0; i < article.peopleWhoLikedArticle.length; i++) {
                        if (article.peopleWhoLikedArticle[i].equals(user._id))
                            article.hasLiked = true;
                    }
                    article.hasBookmarked = false;
                    for (let i = 0; i < user.bookmarkedArticles.length; i++) {
                        if (user.bookmarkedArticles[i].equals(articleId))
                            article.hasBookmarked = true;
                    }
                    delete article.peopleWhoLikedArticle;
                    callback(error, article)
                }
            })
        }
    })
}
