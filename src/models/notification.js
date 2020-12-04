const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    notification: [{
        message: String,
        userProfilePic: String,
        hasSeen: Boolean,
        createdOn: { type: Date }
    }]
});

module.exports = mongoose.model("Notification", NotificationSchema);