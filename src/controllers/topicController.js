const TopicDao=require("../dao/topicDao");

module.exports.getSimilarTopics=function(topic,callback){
    TopicDao.findSimilarTopics(topic,function(error,result){
        callback(error,result);
    })

}