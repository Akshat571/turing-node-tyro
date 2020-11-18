const TopicDao=require("../dao/topicDao");

module.exports.getSimilarTopics=function(topic,callback){
    console.log("Controller-->",topic)
    TopicDao.findSimilarTopics(topic,function(error,result){
        callback(error,result);
    })

}