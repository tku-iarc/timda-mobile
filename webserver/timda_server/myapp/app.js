var path = require('path')
var express = require('express')
var app = require('express')();
var http = require('http').Server(app);

app.get('/', function (req, res) {
    app.use(express.static(path.resolve('..', 'pages')));
    res.sendFile(path.resolve('..', 'pages/index.html'));
});


http.listen(8080, function () {
    console.log('listening on http://localhost:8080');
});
