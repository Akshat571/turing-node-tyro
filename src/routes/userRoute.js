const express=require('express');
const router =express.Router();
const url=require('url')
const controller=require('../controllers/userController');
const User=require('../models/user');
const { handleResponse } = require('../utils');

router.post('/',function(req,res){
  
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
module.exports=router;