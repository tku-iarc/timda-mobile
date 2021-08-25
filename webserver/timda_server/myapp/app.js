var path = require('path')
var express = require('express')
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var shutdown = require('shutdown');
app.get('/', function (req, res) {
    app.use(express.static(path.resolve('..', 'pages')));
    res.sendFile(path.resolve('..', 'pages/index.html'));
});


http.listen(8083, function () {
    console.log('listening on http://localhost:8083');
});
