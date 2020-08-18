const express = require('express')
const fs      = require('fs');
const path    = require('path');
const https = require('https');
const app = express()
const port = 8080

var server  = https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
},app);

/** NodeJS */
app.get('/', function (req, res) {
  app.use(express.static(path.join(__dirname, '../pages')));
  app.use(express.static(path.join(__dirname, '..')));

  res.sendFile(path.join(__dirname + '/../pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

/** Socket.io */
const io = require('socket.io').listen(server);
io.on('connect', (socket) => {
  console.log('A user connected.');

  io.emit("news", "Hello from Socket.io server");

  /** Pass data from web ui to ROS strategy thru service */
  socket.on('ping', (data) => {
    console.log('Call service with: '+data);
    io.emit("pong", "PONG");
  });

  socket.on('chat message', function (msg) {
    console.log('message:' + msg);
    // socket.broadcast.emit('chat message', msg);
    io.emit('chat message', msg);
  });

  socket.on('error', (error) => {
    console.log("Socket.io error occured: " + error);
  });

  socket.on('disconnect', () => {
    console.log("A user go out");
  });
});

