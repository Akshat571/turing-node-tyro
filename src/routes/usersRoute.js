const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");
const { handleResponse, tokenAuthincator } = require("../utils");
const StatusCodes = require('http-status-codes').StatusCodes;

// /users/?count=? (Numeric value)
router.get("/", (req, res) => {
  tokenAuthincator(req, res, function (error, verifiedJwt) {
    if (error) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: { message: "UNAUTHORIZED" }
      })
    } else {
      let count = req.query.count;
      controller.retriveUserByCount(count, function (userError, userArr) {
        if (userError) {
          res.send({
            userError: userError.name
          })
        } else {
          res.send(userArr);
        }
      })
    }
  })
})

module.exports = router;