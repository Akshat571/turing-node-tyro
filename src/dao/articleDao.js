const Article=require('../models/article');


module.exports.createArticle=function(title,topics,content,authorId,success ){
        const date=new Date();
        var newArticle=new Article({author:authorId,title:title,content:content,topics:null,count:4,createdOn:date

    });
    newArticle.save(function (error, savedArticle) {
        success(error, savedArticle);
      });


};