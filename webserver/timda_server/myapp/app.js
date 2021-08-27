var path = require('path')
var express = require('express')
var app = require('express')();
var app2 = require('express')();
var http = require('http').Server(app);
var http2 = require('http').Server(app2);
var io = require('socket.io')(http);
var shutdown = require('shutdown');
app.get('/', function (req, res) {
    app.use(express.static(path.resolve('..', 'pages')));
    res.sendFile(path.resolve('..', 'pages/index.html'));
});
app2.get('/', function (req, res) {
    app2.use(express.static(path.resolve('..', 'customer_web')));
    res.sendFile(path.resolve('..', 'customer_web/index.html'));
});


http.listen(8083, function () {
    console.log('listening on http://localhost:8083');
});


http2.listen(8082, function () {
    console.log('listening on http://localhost:8082');
});