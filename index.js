const express = require('express');
const app = express();
const router = express.Router();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));
app.set('view engine', 'ejs');

router.get('/', function (req, res) {
    res.send('Hello world');
});
router.get('/room', function (req, res) {
    const room = req.query.id || 'default';
    const mimetype = 'image/' + (req.query.mt || 'jpeg');
    const quality = req.query.q || '0.75';
    res.render('webcam', { room: room, mimetype: mimetype, quality: quality });
});
router.get('/room/:id', function (req, res) {
    const room = req.params.id || 'default';
    const mimetype = 'image/' + (req.query.mt || 'jpeg');
    const quality = req.query.q || '0.75';
    res.render('webcam', { room: room, mimetype: mimetype, quality: quality });
});
app.use(router);

const roomMap = {};
io.on('connection', function (socket) {
    console.log('websocket connect: %s %s', socket.client.conn.remoteAddress, socket.id);

    socket.on('disconnect', function () {
        console.log('websocket disconnect: %s', socket.id);
        if (roomMap.hasOwnProperty(socket.id)) {
            const room = roomMap[socket.id];
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
            const room = roomMap[socket.id];
            socket.to(room).emit('camera-cast', { id:socket.id, dataURL: dataURL });
        }
    });

    socket.on('camera-loopback', function (dataURL) {
        socket.emit('camera-cast', { id:socket.id, dataURL: dataURL });
    });
});

const port = process.env.PORT || 3000;
http.listen(port, function () {
    console.log('listening on *:', port);
});