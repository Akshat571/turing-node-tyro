const  User  = require('../models/user');
//const mongoose = require("mongoose");



module.exports.createUser=function(name,email,password,success){
    var user=new User({name,email,password});
    user.save(function(error,newUser){
        console.log("user created inside dao of register=>",newUser);
        success(error,newUser)
    });
    
}

module.exports.getUser = function(email,callback) {
    User.findOne({email:email},function(err,docs) {
        if(err) {
            // console.log("================ I AM HERE =============");
            // console.log(err);
            callback(err,null);
        } else {
            callback(err,docs);
        }
    });
}