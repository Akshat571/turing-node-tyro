const mongoose = require("mongoose");
const User = require("./user");
const Topic = require("./topic");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    _id: Schema.Types.ObjectId,
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    topics: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
    count: { type: Number },
    CreatedOn: { type: Date },
});

module.exports = mongoose.model("Article", ArticleSchema);
