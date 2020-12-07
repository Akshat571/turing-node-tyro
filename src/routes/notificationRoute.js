const express = require("express");
const router = express.Router();
const { tokenAuthenticator } = require("../utils");
const StatusCodes = require('http-status-codes').StatusCodes;
const controller = require('../controllers/notificationController')

router.get('/', (req, res) => {
    tokenAuthenticator(req, res, function (error, verifiedJwt) {
        if (error) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                error: { message: "UNAUTHORIZED" }
            })
        } else {
            controller.retriveAllNotifications(verifiedJwt.email, function (error, notifications) {
                if (error) {
                    return res.status(StatusCodes.UNAUTHORIZED).json({
                        result: {
                            "message": error.name
                        }
                    })
                } else {
                    res.send(notifications);
                }
            })
        }
    })
})

router.put('/clear',(req,res)=>{
    var notifications=req.body.notifications;
    tokenAuthenticator(req,res,function(error,verifiedJwt){
        if (error) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                error: { message: "UNAUTHORIZED" }
            })
        }else{
            var userEmail = verifiedJwt.email;
            controller.clearNotification(userEmail,notifications,function(error,result){
                if(error){
                    return res.status(StatusCodes.UNAUTHORIZED).json({
                        error: { message: error }
                    }) 
                }else{
                    return res.status(StatusCodes.CREATED).json({
                        result: {
                            "message": "notificatons cleared"
                        }
                    })
                }
            })
        }
    })
})
module.exports = router;