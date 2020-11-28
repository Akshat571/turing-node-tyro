const articleDao = require("../dao/articleDao");
const userDao = require("../dao/userDao");
const topicDao=require("../dao/topicDao")

module.exports.addBookMark=function(userEmail,articleId,callback){
    userDao.getUser(userEmail,function(error,user){
        if (error){
            callback(error,null)
        }else{
            articleDao.getArticle(articleId,function(error,article){
                if(error){
                    callback(error,null)
                }else{
                    if(checkIfBookmarked(user.bookmarkedArticles,articleId)){
                        callback(error,null)
                    }
                    else{
                        userDao.addBookmark(userEmail,articleId,function(error,updatedUser){
                            callback(error,updatedUser)
                        })
                    }
                }
            })
        }
    })
}

checkIfBookmarked=function(articlesBookmarked,articleId){
    return articlesBookmarked.includes(articleId);

}

module.exports.removeBookmark=function(userEmail,articleId,callback){
   articleDao.getArticle(articleId,function(error,article){
       if(error){
           callback(error,null)
       }else{
           userDao.removeBookmark(userEmail,articleId,function(error,user){
               callback(error,user)
           })
       }
   })
}
module.exports.retriveAllBookmarkedArticles = function (email, callback) {
    userDao.getAllBookmarkedArticle(email, function (error, bookmarkedArticles) {
        if (error || bookmarkedArticles.length == 0)
            callback(error, null);
        else {
            let articles = bookmarkedArticles.bookmarkedArticles;
            callback(null, articles)
        }
    })
}