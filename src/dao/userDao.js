const User = require("../models/user");
const Notification = require('../models/notification');

module.exports.createUser = function (name, email, password, success) {
    var user = new User({ name, email, password });
    user.save(function (error, newUser) {
        success(error, newUser);
    });
    var notificationUser = new Notification({ email });
    notificationUser.save(function (error, newUser) {
    });
};

module.exports.getUser = function (email, callback) {
    User.findOne({ email: email }, function (err, docs) {
        if (err) {
            callback(err, null);
        } else {
            callback(err, docs);
        }
    });
};

module.exports.getUserByCount = function (count, callback) {
    let projection = { articles: 0, topics: 0, peopleFollowing: 0, password: 0, __v: 0, bookmarkedArticles: 0, bio: 0 };
    if (count !== undefined) {
        User.find({}, projection, { limit: Number(count) }).lean().
            exec(function (error, user) {
                callback(error, user);
            })
    } else {
        User.find({}, projection).lean().
            exec(function (error, user) {
                callback(error, user);
            })
    }
}

module.exports.followAnUser = (userId, userEmail, success) => {
    User.findOne({ _id: userId }, function (error, existingUser) {
        if (error) {
            success({

                message: "Couldnt find user"

            }, null, null)
            return;
        }
        else {
            User.findOne({ email: userEmail }, function (error, user) {
                if (user) {
                    user.peopleFollowing.push(userId);
                    user.save(function (error, user) {
                        success(error, user);
                    })
                } else {
                    success({
                        "result": {
                            message: "Couldnt find user"
                        }
                    }, null, null)
                    return;
                }
            });
            User.updateOne({ _id: userId }, { $push: { followers: userEmail } })
                .exec(function (error, result) {
                });
        }
    })
}

module.exports.unfollowAnUser = (userId, userEmail, success) => {
    User.findOne({ _id: userId }, function (error, exisitingUser) {
        if (error) {
            success({

                message: "Couldnt find user"

            }, null, null)
            return;
        }
        else {
            User.findOne({ email: userEmail }, function (error, user) {
                if (user) {
                    for (var i in user.peopleFollowing) {
                        if (user.peopleFollowing[i] == userId) {
                            user.peopleFollowing.splice(i, 1);
                        }
                    }
                    user.save(function (error, user) {
                        success(error, user);
                    })
                } else {
                    success({
                        "result": {
                            message: "Couldnt find topic"
                        }
                    }, null, null)
                    return;
                }
            });
        }
    })
}

module.exports.updateProfilePic = function (email, imgUrl, public_id, callback) {
    const filter = { email: email };
    const update = { $set: { "profilePic.url": imgUrl, "profilePic.public_id": public_id } };
    User.findOneAndUpdate(filter, update, { new: true }, function (error, docs) {
        if (error)
            callback(error, null);
        else {
            callback(error, docs);
        }
    })
}

module.exports.getProfilePic = function (email, callback) {
    User.findOne({ email: email }, 'profilePic', function (err, docs) {
        if (err) {
            callback(err, null);
        } else {
            callback(err, docs);
        }
    });
};

module.exports.setArticlesForUser = function (authorId, articleId, success) {
    User.findOne({ _id: authorId }, function (error, author) {
        if (error) {
            success(error, null)
        } else {
            author.articles.push(articleId);
            author.save(function (error, user) {
                success(error, user)
            })
        }
    })
}

module.exports.addBookmark = function (userEmail, articleId, success) {
    User.findOne({ email: userEmail }, function (error, user) {
        if (error) {
            success({
                message: "Couldnt find user"
            }, null, null)
            return;
        } else {
            user.bookmarkedArticles.push(articleId);
            user.save(function (error, newUser) {
                success(error, newUser);
            })

        }
    })
}

module.exports.removeBookmark = function (userEmail, articleId, success) {
    User.findOne({ email: userEmail }, function (error, user) {
        if (user) {
            for (var i in user.bookmarkedArticles) {
                if (user.bookmarkedArticles[i] == articleId) {
                    user.bookmarkedArticles.splice(i, 1);
                }
            }
            user.save(function (error, user) {
                success(error, user);
            })
        } else {
            success({
                "result": {
                    message: "Couldnt find article"
                }
            }, null, null)
            return;
        }
    });
}

module.exports.getAllBookmarkedArticle = (email, callback) => {
    User.findOne(
        {
            email: email
        },
        {
            _id: 0,
            __v: 0,
            name: 0,
            password: 0,
            email: 0,
            articles: 0,
            topics: 0,
            profilePic: 0,
            peopleFollowing: 0,

        },
        {}).
        populate({
            path: 'bookmarkedArticles', select: 'content title author createdOn _id',
            populate: {
                path: 'author', select: 'name email _id profilePic',
            },
            options: { sort: { 'createdOn': -1 } }
        }).
        exec(function (error, feed) {
            if (error)
                callback(error, null);
            else
                callback(error, feed);

        })
}

module.exports.addTopic = function (userEmail, topicId, success) {
    User.findOne({ email: userEmail }, function (error, user) {
        if (user) {
            user.topics.push(topicId);
            user.save(function (error, user) {
                success(error, user);
            })
        } else {
            success({

                message: "Couldnt find user"

            }, null, null)
            return;
        }
    });
}

module.exports.removeTopic = function (userEmail, topicId, success) {
    User.findOne({ email: userEmail }, function (error, user) {
        if (user) {
            for (var i in user.topics) {
                if (user.topics[i] == topicId) {
                    user.topics.splice(i, 1);
                }
            }
            user.save(function (error, user) {
                success(error, user);
            })
        } else {
            success({

                message: "Couldnt find user"

            }, null, null)
            return;
        }
    });
}

module.exports.addBio = function (userEmail, bio, success) {
    User.findOne({ email: userEmail }, function (error, user) {
        if (error) {
            success({

                message: "Couldnt find user"
            }, null, null)
            return;
        } else {
            user.bio = bio;
            user.save(function (error, updatedUser) {
                success(error, updatedUser)
            })

        }
    })
}
module.exports.getUserProfile = function (userId, callback) {
    User.findById(userId)
        .select('name email profilePic.url bio articles')
        .populate({
            path: 'articles', select: 'title content createdOn'
        })
        .exec(function (error, user) {
            if (error) {
                callback(error, null);
            } else {
                callback(error, user);
            }
        })
};

module.exports.getUserProfileByMail = function (email, callback) {
    User.findOne({ email: email })
        .select('name email profilePic.url bio articles')
        .populate({
            path: 'articles', select: 'title content createdOn'
        })
        .exec(function (error, user) {
            if (error) {
                callback(error, null);
            } else {
                callback(error, user);
            }
        })
};



