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

module.exports.verifyToken=function(token,callback){
  jwt.verify(token, 'secret', (error, verifiedJwt) => {
    console.log("inside util-->",verifiedJwt);
    if(error){
      callback(error,null);
    }else{
      callback(error,verifiedJwt);
    }
  })
}

module.exports.getPayload=function(bearerHeader){
  if(typeof bearerHeader!==undefined){
   const bearer=bearerHeader.split(' ');
   const token=bearer[1];
   return token;

  }else{
    return false;
  }
}

exports.handleResponse = handleResponse;