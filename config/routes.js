var userRoute = require("../src/routes/userRoute");
var usersRoute = require("../src/routes/usersRoute");
var articleRoute = require("../src/routes/articleRoute");
var topicRoute=require("../src/routes/topicRoute")
var topicsRoute=require("../src/routes/topicsRoute")
app = require("../app");

module.exports = function (app) {
  app.use("/user", userRoute);
  app.use('/article',articleRoute);
  app.use('/topic',topicRoute);
  app.use("/users", usersRoute);
  app.use('/topics',topicsRoute);
};
