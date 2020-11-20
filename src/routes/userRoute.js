const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const controller = require("../controllers/userController");
const { handleResponse, tokenAuthincator } = require("../utils");
const { tokenGenerator } = require("../utils");
const StatusCodes = require('http-status-codes').StatusCodes;

router.post('/signup', function (req, res) {
  const { name, email, password } = req.body;
  if (name != null && email != null && password != null) {
    if (password.length < 2) {
      res.status(StatusCodes.BAD_REQUEST).json({
        "error": { message: "BAD_REQUEST" }
      })
      return;
    } else {
      controller.registerUser(name, email, password, function (error, token) {
        if (error) {
          if (error.name === "ValidationError") {
            res.status(StatusCodes.BAD_REQUEST).json({
              "error": { message: "BAD_REQUEST" }
            })
            return;
          }
          res.status(StatusCodes.CONFLICT).json({
            "error": { message: "CONFLICT" }
          })
          return;
        } else {
          if (token != null) {
            res.setHeader('Authorization', 'Bearer ' + token);
            res.status(StatusCodes.OK).json({
              "error": { message: "Successful signup" }
            })
          } else {
            res.status(StatusCodes.UNAUTHORIZED).json({
              "error": { message: "UNAUTHORIZED" }
            });
          }
        }
        handleResponse(error.error, {}, res);
      })
    }

  } else {
    res.status(StatusCodes.NO_CONTENT).json({
      "error": { message: "NO_CONTENT" }
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
          "error": { message: "UNAUTHORIZED" }
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
                  "result": { message: "Successful Login" }
                })
              }
            });
          } else {
            res.status(StatusCodes.UNAUTHORIZED).json({
              "error": { message: "UNAUTHORIZED" }
            });
          }
        });
      }
    });
  } else {
    return res.status(StatusCodes.NO_CONTENT).json({
      "error": { message: "NO_CONTENT" }
    });
  }
});



router.get('/follow/:id', function (req, res) {
  const userId = req.params.id;
  if (userId != null) {
    tokenAuthincator(req, res, function (error, verifiedJwt) {
      if (error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
<<<<<<< HEAD
          message: "UNAUTHORIZED"
=======
          "error": { message: "UNAUTHORIZED" }
>>>>>>> ad1c19fa185e5695d2917307395599cec666ef75
        })
      } else {
        var userEmail = verifiedJwt.email;
        controller.followUser(userId, userEmail, function (error, result) {
<<<<<<< HEAD
          //console.log(result);
=======
>>>>>>> ad1c19fa185e5695d2917307395599cec666ef75
          if (error) {
            res.status(StatusCodes.BAD_REQUEST)
          } else if (result == null) {
            res.status(StatusCodes.BAD_REQUEST)
            result = {
              "error": {
                "message": "Already following"
              }
            }
<<<<<<< HEAD

          } else {
            res.status(StatusCodes.OK)
            result = {
              "success": {
                "message": "Follow successful"
              }
            }

          }
          handleResponse(error, result, res);
        })

      }
    })

  } else {
    return res.status(StatusCodes.NO_CONTENT).json({
      message: "NO CONTENT"
=======
          } else {
            res.status(StatusCodes.OK)
            result = {
              "result": {
                "message": "Follow successful"
              }
            }
          }
          handleResponse(error, result, res);
        })
      }
    })
  } else {
    return res.status(StatusCodes.NO_CONTENT).json({
      "error": { message: "NO_CONTENT" }
>>>>>>> ad1c19fa185e5695d2917307395599cec666ef75
    });
  }

})

router.get('/unfollow/:id', function (req, res) {
  const userId = req.params.id;
  if (userId != null) {
    tokenAuthincator(req, res, function (error, verifiedJwt) {
      if (error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
<<<<<<< HEAD
          message: "UNAUTHORIZED"
=======
          "error": { message: "UNAUTHORIZED" }
>>>>>>> ad1c19fa185e5695d2917307395599cec666ef75
        })
      } else {
        var userEmail = verifiedJwt.email;
        controller.unfollowUser(userId, userEmail, function (error, result) {
<<<<<<< HEAD

=======
>>>>>>> ad1c19fa185e5695d2917307395599cec666ef75
          if (error) {
            res.status(StatusCodes.BAD_REQUEST)
          } else {
            res.status(StatusCodes.OK)
            result = {
<<<<<<< HEAD
              "success": {
=======
              "result": {
>>>>>>> ad1c19fa185e5695d2917307395599cec666ef75
                "message": "Unfollow successful"
              }
            }
          }
          handleResponse(error, result, res);
        })
<<<<<<< HEAD

      }
    })

  } else {
    return res.status(StatusCodes.NO_CONTENT).json({
      message: "NO CONTENT"
=======
      }
    })
} else {
    return res.status(StatusCodes.NO_CONTENT).json({
      "error": { message: "NO_CONTENT" }
>>>>>>> ad1c19fa185e5695d2917307395599cec666ef75
    });
  }
})

module.exports = router;
