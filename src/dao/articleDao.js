const Article = require('../models/article');
const User = require('../models/user');
const Topic = require('../models/topic')


module.exports.createArticle = function (title, topics, content, authorId, success) {
  const date = new Date();
  var newArticle = new Article({
    author: authorId, title: title, content: content, topics: topics, count: 4, createdOn: date

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
    Topic.find({_id:{$in:topics}},function(error,result){
      if(result){
        for(var i=0;i<result.length;i++){
           result[i].articles.push(publishedPost);
           result[i].save();

        }
      }

    })
    
  })


};

