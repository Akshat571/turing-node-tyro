const jwt = require("jsonwebtoken");

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

exports.handleResponse = handleResponse;