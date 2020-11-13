const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const url = require("url");
const controller = require("../controllers/userController");
const User = require("../models/user");
const { handleResponse } = require("../utils");
const { tokenGenerator } = require("../utils");
const { json } = require("express");
const StatusCodes = require('http-status-codes').StatusCodes;
const ReasonPhrases = require('http-status-codes').ReasonPhrases;

router.post('/signup', function (req, res) {
  const { name, email, password } = req.body;
  if (name != null && email != null && password != null) {
    controller.registerUser(name, email, password, function (error, token) {
      if (error) {
        res.status(StatusCodes.CONFLICT).json({
          "message": error
        })
        return;
      } else {
        if (token != null) {
          res.setHeader('Authorization', 'Bearer ' + token);
          res.status(StatusCodes.OK).json({
            "message": "SUCCESS"
          })
        } else {
          res.status(StatusCodes.UNAUTHORIZED).json({
            "message": "UNAUTHORIZED"
          });
        }
      }
      handleResponse(error.error, {}, res);
    })
  } else {
    res.status(StatusCodes.NO_CONTENT).json({
      "message": "NO CONTENT"
    });
  }
})

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const plainPassword = req.body.password;
  if (email != (null || undefined) && plainPassword != (null || undefined)) {
    controller.retriveUser({ email: email }, function (error, user) {
      if (error || user === null) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          "error": error
        });
      } else {
        bcrypt.compare(plainPassword, user.password, (error, result) => {
          if (error) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
              "error": error
            });
          }
          if (result) {
            tokenGenerator(user.name, user.email, "secret", function (error, token) {
              if (error) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                  error: error
                })
              } else {
                res.setHeader('Authorization', 'Bearer ' + token);
                res.status(StatusCodes.OK).json({
                  message: "SUCCESS"
                })

              }
            });
          } else {
            res.status(StatusCodes.UNAUTHORIZED).json({
              message: "UNAUTHORIZED"
            });
          }
        });
      }
    });
  } else {
    return res.status(StatusCodes.NO_CONTENT).json({
      message: "NO CONTENT"
    });
  }
});

module.exports = router;
