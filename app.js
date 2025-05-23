const express = require('express');
const app = express();
const http = require("http");
const socketio = require("socket.io");
const path = require("path");
const { log } = require('console');

const server = http.createServer(app);
const io = socketio(server);

app.set('view engine', "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function(socket) {
    log(`User connected: ${socket.id}`);

    socket.on("send-location", function(data) {
        io.emit("receive-location", { id: socket.id, ...data });
    });

    socket.on("disconnect", function() {
        log(`User disconnected: ${socket.id}`);
        io.emit('user-disconnected', socket.id);
    });
});

app.get("/", function(req, res) {
    res.render("index");
});

server.listen(3000, () => {
    log('Server is running on port 3000');
});
