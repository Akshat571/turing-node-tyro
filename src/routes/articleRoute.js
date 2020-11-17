const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const controller = require("../controllers/articleController");
const { handleResponse, getPayload, verifyToken } = require("../utils");
const StatusCodes = require('http-status-codes').StatusCodes;

router.post('/createPost',function(req,res){
    console.log("hi");
    const {title,topics,content}=req.body;
    console.log(title,topics,content);
    if(title!=null && content!=null && topics!=null){
        const bearerHeader=req.headers['authorization'];
        console.log("Header with bearer -->",bearerHeader);
        var token=getPayload(bearerHeader);
        console.log("Token -->",token);
        if(token==null){
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "BAD REQUEST"
              })
              return;
        }else{
            verifyToken(token,function(error,verifiedJwt){
                console.log("verified token-->",verifiedJwt);
                if(error){
                   return res.status(StatusCodes.UNAUTHORIZED).json({
                        message:"UNAUTHORIZED"
                    })
                }else{
                    var author=verifiedJwt.email;
                    console.log("Auther--->",author);
                    return res.status(StatusCodes.OK).json({
                        message:"ok"
                    })
                }
            })
        }

    }else{
        res.status(StatusCodes.NO_CONTENT).json({
            "message": "NO CONTENT"
          });
    }
})

module.exports = router;