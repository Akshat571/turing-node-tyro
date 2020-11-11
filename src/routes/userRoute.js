const express = require('express');
const router = express.Router();
const url = require('url')
const controller = require('../controllers/userController');
const User = require('../models/user');
const { handleResponse } = require('../utils');

router.post('/signup', function (req, res) {

    const { name, email, password } = req.body;
    if (name != null && email != null && password != null) {
        controller.registerUser(name, email, password, function (error, result, token) {
            if(error){
                res.status(409);
            }
            handleResponse(error, { token }, res);
        })
    }else{
        return res.status(204).json({});
    }
})
module.exports = router;