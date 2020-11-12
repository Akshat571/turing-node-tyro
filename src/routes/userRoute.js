const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const url = require("url");
const controller = require("../controllers/userController");
const User = require("../models/user");
const { handleResponse } = require("../utils");
const { tokenGenerator } = require("../utils");
const { json } = require("express");

router.post('/signup', function (req, res) {
  const { name, email, password } = req.body;
  if (name != null && email != null && password != null) {
    controller.registerUser(name, email, password, function (error, result, token) {
      if (error) {
        res.status(409);
      }
      res.setHeader('Authorization', 'Bearer ' + token);
      handleResponse(error, {}, res);
    })
  } else {
    return res.status(204).json({});
  }
})

router.post("/login", (req, res) => {
  const email = req.body.email;
  const plainPassword = req.body.password;
  if (email != (null || undefined) && plainPassword != (null || undefined)) {
    controller.retriveUser({ email: email }, function (error, user) {
      if (error || user == null) {
        return res.status(401).json({
          message: "Auth Unsuccessfull",
        });
      } else {
        bcrypt.compare(plainPassword, user.password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: "Auth Unsuccessfull",
            });
          }
          if (result) {
            const token = tokenGenerator(user.name, user.email, "secret")
            res.setHeader('Authorization', 'Bearer ' + token);
            return res.status(200).json({});
          }
          return res.status(401).json({
            message: "Auth Unsucessfull/Bad Password",
          });
        });
      }
    });
  } else {
    return res.status(204).json({});
  }
});

module.exports = router;
