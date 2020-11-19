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
    articleDao.getFeed(email, function (error, feedArr) {
        if (error || feedArr.length == 0)
            callback(error, null);
        else
            callback(error, feedArr);
    })
}