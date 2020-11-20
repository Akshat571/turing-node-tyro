var mongoose = require("mongoose");
module.exports.start = function (success) {
  // Build the connection string
  //var dbURI = "mongodb://localhost/tyroDB";

  var dbURI = "mongodb+srv://akshat:Qwerty@123@tyrocluster.e1fys.mongodb.net/tyroDB";
  // Create the database connection
  mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

  // CONNECTION EVENTS
  // When successfully connected
  mongoose.connection.on("connected", function () {
    success();
    console.log("Mongoose default connection open to " + dbURI);
  });

  // If the connection throws an error
  mongoose.connection.on("error", function (err) {
    console.log("Mongoose default connection error: " + err);
  });

  // When the connection is disconnected
  mongoose.connection.on("disconnected", function () {
    console.log("Mongoose default connection disconnected");
  });

  // If the Node process ends, close the Mongoose connection
  process.on('SIGINT', function () {
    mongoose.connection.close(function () {
      console.log('Mongoose default connection disconnected through app termination');
      process.exit(0);
    });
  });
};
