const path = require('path');

const express = require('express');

module.exports = function(app) {
   // app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
   // app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
}