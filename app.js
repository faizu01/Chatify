// In app.js, we're establishing an HTTP server using Express to serve your application's web pages, static assets, and handle HTTP requests.
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const path = require('path');
const port = 5000;

// Express specific stuff
app.use('/static', express.static('static'));

// Pug specific stuff
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.get("/", (req, res) => {
    res.status(200).render('index.pug');
});

const server = app.listen(port, () => {
    console.log(`Server started successfully on port ${port}`);
});

const io = socketIo(server); // Attach Socket.io to the existing server instance
// app.locals.io = io;
const users = {};
io.on('connection', socket => {
    //if any new user join then let them connected to the server
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        // Sending a custom event to the client
        socket.broadcast.emit('user-joined', name);
    });

    //if someone send message broadcast to all
    socket.on('send', message => {
        // Sending a custom event to the client
        socket.broadcast.emit('recieve', { message: message, name: users[socket.id] });
    });

    //disconnect is an event that gets fire automatically unlike like send and new-user-joined it's user defined event thatswhy listened in index.js
    socket.on('disconnect', message => {

        // Sending a custom event to the client
        socket.broadcast.emit('leaved', users[socket.id]);
        delete users[socket.id];
    });
});
