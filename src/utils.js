const jwt = require("jsonwebtoken");
const StatusCodes = require('http-status-codes').StatusCodes;

function handleResponse(error, result, res) {
  if (error != null) {
    res.send({
      error: error
    });
  } else {
    res.send(result);
  }
}

module.exports.tokenGenerator = function (name, email, secret, callback) {
  jwt.sign({ name: name, email: email },
    secret,
    { expiresIn: '1h' },
    function (err, token) {
      if (err) {
        callback(err, null);
      } else {
        callback(err, token);
      }
    });
}

function verifyToken(token, callback) {
  jwt.verify(token, 'secret', (error, verifiedJwt) => {
    if (error) {
      callback(error, null);
    } else {
      callback(error, verifiedJwt);
    }
  })
}

function getPayload(bearerHeader) {
  if (typeof bearerHeader !== undefined) {
    const bearer = bearerHeader.split(' ');
    const token = bearer[1];
    return token;
  } else {
    return false;
  }
}

module.exports.tokenAuthenticator = function (req, res, callback) {
  const bearerHeader = req.headers['authorization'];
  if (bearerHeader == null || bearerHeader == undefined) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      "error": { message: "BAD_REQUEST" }
    })
  }
  var token = getPayload(bearerHeader);
  if (token == null) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      "error": { message: "BAD_REQUEST" }
    })
  }
  verifyToken(token, function (error, verifiedJwt) {
    callback(error, verifiedJwt);
  })
}

exports.handleResponse = handleResponse;