const  User  = require('../models/user');
//const mongoose = require("mongoose");



module.exports.createUser=function(name,email,password,success){
    var user=new User({name,email,password});
    user.save(function(error,newUser){
        console.log("user created inside dao of register=>",newUser);
        success(error,newUser)
    });
    
}