const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const controller = require("../controllers/userController");
const { handleResponse } = require("../utils");
const { tokenGenerator } = require("../utils");
const StatusCodes = require('http-status-codes').StatusCodes;

router.post('/signup', function (req, res) {
  const { name, email, password } = req.body;
  if (name != null && email != null && password != null) {
    if (password.length < 2) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "BAD REQUEST"
      })
      return;
    } else {
      controller.registerUser(name, email, password, function (error, token) {
        if (error) {
          if (error.name === "ValidationError") {
            res.status(StatusCodes.BAD_REQUEST).json({
              message: "BAD REQUEST"
            })
            return;
          }
          res.status(StatusCodes.CONFLICT).json({
            "message": "CONFLICT"
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
    }

  } else {
    res.status(StatusCodes.NO_CONTENT).json({
      "message": "NO CONTENT"
    });
  }
})

router.post("/login", (req, res) => {
  const email = req.body.email;
  const plainPassword = req.body.password;
  if (email != (null || undefined) && plainPassword != (null || undefined)) {
    controller.retriveUser({ email: email }, function (error, user) {
      if (error || user === null) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          "error": "UNAUTHORIZED"
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
