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
        else {
            let ObjectIdset = new Set();
            let articles = [];
            let uniqueArticles = [];
            feedArr.topics.map(obj => {
                articles = [...articles, ...obj.articles];
            })
            feedArr.peopleFollowing.map(obj => {
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

module.exports.viewArticle=function(articleId,callback){
    articleDao.increaseView(articleId,function(error,newArticle){
        if (error) {
            callback(error, null);
        } else {
            callback(error, newArticle);
        }
    })
}

module.exports.bookMarkAnArticle=function(userEmail,articleId,callback){
    articleDao.checkIfArticleIsAlreadyBookmarked(articleId, userEmail, function (error, result) {
        if (result == null) {
            callback(error, null);
        }
        else {
            articleDao.bookMarkArticle(userEmail,articleId,function(error,user){
               callback(error,user);
            })
           
        }
    })
 
}

module.exports.removeBookmark = function ( userEmail,articleId, callback) {
    articleDao.removeBookmark(articleId, userEmail, function (error, result) {
        callback(error, result)
    })
}