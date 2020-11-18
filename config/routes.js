var userRoute = require("../src/routes/userRoute");
var articleRoute = require("../src/routes/articleRoute");
var topicRoute=require("../src/routes/topicRoute")
app = require("../app");

module.exports = function (app) {
  app.use("/user", userRoute);
  app.use('/article',articleRoute);
  app.use('/topic',topicRoute)
};
