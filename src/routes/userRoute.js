const express=require('express');
const bcrypt = require('bcrypt');
const router =express.Router();
const jwt = require('jsonwebtoken');
const url=require('url')
const controller=require('../controllers/userController');
const User=require('../models/user');
const { handleResponse } = require('../utils');

router.post('/signup',function(req,res){
  
    console.log('in router');
    if(req.body.name!=null){
        if(req.body.email!=null){
            if(req.body.password!=null){
                controller.registerUser(req.body.name,req.body.email,req.body.password,function(error,result,token){
                    handleResponse(error,{token},res);
                })
            }
        }
    }
})

router.post('/login', (req,res) => {
    const email = req.body.email;
    const plainPassword = req.body.password;
        if(email != null && plainPassword != null) {
            controller.retriveUser({email:email}, function(error,user) {
                if(error || user == null) {
                    return res.status(401).json({
                        message: "Auth Unsuccessfull"
                    });
                } else {
                    bcrypt.compare(plainPassword,user.password, (err, result ) => {
                        if(err) {
                            return res.status(401).json({
                                message: "Auth Unsuccessfull"
                            });
                        }
                        if(result) {
                            const token = jwt.sign(
                                {
                                name: user.name,
                                email: user.email
                                },
                                process.env.JWT_KEY || "secret",
                                {
                                    expiresIn: "1h"
                                }
                        )
                            return res.status(200).json({
                                token: token
                            });
                        }
                        return res.status(401).json({
                            message: "Auth Unsucessfull/Bad Password"
                        });
                    });
                }
        });
    } else {
        res.status(204);
    }
})

module.exports=router;