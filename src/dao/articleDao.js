const Article=require('../models/article');


module.exports.createArticle=function(title,content,author,topics ){
        var newArticle=new Article({author:author._id,title:title,content:content,topics:topics

    });
    newArticle.save(function (error, savedArticle) {
        success(error, savedArticle);
      });


};