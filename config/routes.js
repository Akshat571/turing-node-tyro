var userRoute = require("../src/routes/userRoute");
app = require("../app");

module.exports = function (app) {
  app.use("/user", userRoute);
};
