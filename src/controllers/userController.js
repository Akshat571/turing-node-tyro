const userDao=require('../dao/userDao');
const User = require('../models/user');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.registerUser=function(name,email,password,callback){
   var hash=bcrypt.hashSync(password,10);
   const user=new User({
                        _id:email,
                        name:name,
                        password:hash
                    });
    password=hash; // TODO do not assign props into new value 
    userDao.createUser(name,email,password,function(error,user){        
        if(error){
                callback(error,null);
                return;
                }else{
                        var token=jwt.sign({
                        name:user.name,
                        email:user.email
                    },
                    "secret") // TODO 
                            }
                            callback(error,user,token)
                        })
}

module.exports.retriveUser = function(email, callback) {
    console.log("in controller");
    userDao.getUser(email.email,function(error,docs){
        if(error || docs == null) {
            callback(error,null);
        } else {
             callback(error,docs);
        } 
    });
}