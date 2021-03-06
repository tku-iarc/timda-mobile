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
        setTimeout(function () {
            io.emit('pong', 'PONG')
        }, 500);
    });

    /**
     * shutdown needs superuser's permission
     * Give the user permission by $visudo
     * (user name) ALL=NOPASSWD:/sbin/shutdown
     */
    socket.on('shutdown', function () {
        require('child_process').exec('/sbin/shutdown -h now', console.log);
	//shutdown.shutdownGracefully();
    });
});

http.listen(8080, function () {
    console.log('listening on http://localhost:8080');
});
