var path = require('path')
var express = require('express')
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
    app.use(express.static(path.resolve('..', 'pages')));
    res.sendFile(path.resolve('..', 'pages/chat.html'));
});

io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('chat message', function (msg) {
        console.log('message:' + msg);
        // socket.broadcast.emit('chat message', msg);
        io.emit('chat message', msg);
    });

    socket.on('ping', function (msg) {
        console.log('Get Ping');
        io.emit('pong', 'PONG');
    });
});

http.listen(3000, function () {
    console.log('listening on http://localhost:3000');
});
