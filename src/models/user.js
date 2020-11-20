const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Article = require("./article");
const Topic = require("./topic");

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  profilePic: { type: String },
  articles: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
  topics: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
  peopleFollowing: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model("User", UserSchema);
