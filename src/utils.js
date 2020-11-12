const jwt = require("jsonwebtoken");

function handleResponse(error, result, res) {
    if (error != null) {
        res.send({
            error: error
        });
    } else {
        console.log(result);
        res.send(result);
    }
}

function tokenGenerator(name,email,secret){
    var token = jwt.sign(
        {
          name: name,
          email: email,
        },
        "secret",
        {
          expiresIn: "1h",
        }
      );
      return token;
}

exports.handleResponse = handleResponse;
exports.tokenGenerator=tokenGenerator;