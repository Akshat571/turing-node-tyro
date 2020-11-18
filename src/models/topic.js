const mongoose = require("mongoose");
const User = require("./user");
const Article = require("./article");
const Schema = mongoose.Schema;


const TopicSchema = new Schema({
    
    topicName: {
        type: String,
        required: true,
    },
    articles: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
});

module.exports = mongoose.model("Topic", TopicSchema);
