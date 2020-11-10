var userRoute = require('../src/routes/userRoute');
var app=require('../app')
module.exports = function(app) {
    app.use('/signup', userRoute);
   
}