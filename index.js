var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.send('Hello world');
});

var roomMap = {};
io.on('connection', function (socket) {
    console.log('websocket connect: %s %s', socket.client.conn.remoteAddress, socket.id);

    socket.on('disconnect', function () {
        console.log('websocket disconnect: %s', socket.id);
        if (roomMap.hasOwnProperty(socket.id)) {
            var room = roomMap[socket.id];
            socket.to(room).emit('camera-out', socket.id);
            delete roomMap[socket.id];
        }
    });

    socket.on('chat', function (msg) {
        console.log("chat:", msg);
        io.sockets.emit('chat', msg);
    });

    socket.on('join', function (room) {
        console.log("join:", room, socket.id);
        socket.join(room, function (err) {
            if (err) console.err(err);
            else roomMap[socket.id] = room;
        });
    });

    socket.on('camera-cast', function (dataURL) {
        if (roomMap.hasOwnProperty(socket.id)) {
            var room = roomMap[socket.id];
            socket.to(room).emit('camera-cast', { id:socket.id, dataURL: dataURL });
        }
    });

    socket.on('camera-loopback', function (dataURL) {
        socket.emit('camera-cast', { id:socket.id, dataURL: dataURL });
    });
});

var port = process.env.PORT || 3000;
http.listen(port, function () {
    console.log('listening on *:', port);
});