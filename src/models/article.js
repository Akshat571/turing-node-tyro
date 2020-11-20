const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
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
    views: { type: Number },
    createdOn: { type: Date },
});

module.exports = mongoose.model("Article", ArticleSchema);
