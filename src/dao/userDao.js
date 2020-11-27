const User = require("../models/user");

module.exports.createUser = function (name, email, password, success) {
    var user = new User({ name, email, password });
    user.save(function (error, newUser) {
        success(error, newUser);
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
    let projection = { articles: 0, topics: 0, peopleFollowing: 0, password: 0, __v: 0, bookmarkedArticles: 0 };
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

module.exports.checkIfUserAlreadyIsFollowing = (userId, userEmail, callback) => {
    User.findOne({ email: userEmail }, function (error, user) {
        if (user) {
            var flag = 0
            for (var i in user.peopleFollowing) {
                if (user.peopleFollowing[i] == userId) {
                    flag = 1;
                    break;
                }
            }
            if (flag == 0) {
                callback(null, user)
            }
            else {
                callback(error, null)
            }
        } else {
            callback({
                "result": {
                    message: "Couldnt find topic"
                }
            }, null, null)
            return;
        }
    });
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

module.exports.setArticlesForUser=function(authorId,articleId,success){
    User.findOne({_id:authorId},function(error,author){
        if(error){
            success(error,null)
        }else{
            author.articles.push(articleId);
            author.save(function(error,user){
                success(error,user)
            })
        }
    })
}

module.exports.addBookmark=function(userEmail,articleId,success){
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

module.exports.removeBookmark=function(userEmail,articleId,success){
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



