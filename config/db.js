var mongoose = require('mongoose');
module.exports.start = function (success) {
    // Build the connection string
    var dbURI = 'mongodb://localhost/tyroDB'; 

    // Create the database connection
    mongoose.connect(dbURI);

    // CONNECTION EVENTS
    // When successfully connected
    mongoose.connection.on('connected', function () {
        success();
        console.log('Mongoose default connection open to ' + dbURI);
    });

    // If the connection throws an error
    mongoose.connection.on('error', function (err) {
        console.log('Mongoose default connection error: ' + err);
    });

    // When the connection is disconnected
    mongoose.connection.on('disconnected', function () {
        console.log('Mongoose default connection disconnected');
    });

    // If the Node process ends, close the Mongoose connection
  

}