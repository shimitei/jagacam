var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.send('Hello world');
});

io.on('connection', function (socket) {
    console.log('websocket connect: %s %s', socket.client.conn.remoteAddress, socket.id);

    socket.on('disconnect', function () {
        console.log('websocket disconnect: %s', socket.id);
    });

    socket.on('chat', function (msg) {
        console.log("chat: " + msg);
        io.sockets.emit('chat', msg);
    });

    socket.on('camera-cast', function (dataURL) {
        socket.broadcast.emit('camera-cast', { id:socket.id, dataURL: dataURL });
    });

    socket.on('camera-loopback', function (dataURL) {
        socket.emit('camera-cast', { id:socket.id, dataURL: dataURL });
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});