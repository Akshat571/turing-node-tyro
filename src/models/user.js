const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
  profilePic: {
    url: {
      type: String
    },
    public_id: {
      type: String
    }
  },
  bio: {
    type: String
  },
  articles: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
  topics: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
  peopleFollowing: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  bookmarkedArticles: [{ type: Schema.Types.ObjectId, ref: 'Article' }]
});

module.exports = mongoose.model("User", UserSchema);
