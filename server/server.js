const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const clients = new Map();

io.on('connection', (socket) => {
    try {
        console.log('A client connected');
        socket.on('register', (name) => {
            clients.set(socket.id, name);
            io.emit('clientList', { mapData: Array.from(clients) });
            console.log(`Client ${name} registered`);
        });

        socket.on('disconnect', () => {
            console.log('A client disconnected');
            clients.delete(socket.id);
            io.emit('clientList', { mapData: Array.from(clients) });
        });
        //clientName is an array of client names
        socket.on('createRoom', ({ clientArray }) => {
            console.log('Creating room');
            const roomName = `room${Math.random().toString(36).substr(2, 9)}`;
            console.log(clientArray)
            clientArray.forEach(async (client) => {
                const clientSocketId = Array.from(clients.keys()).find(
                    (key) => clients.get(key) === client
                );
                //io.to(clientSocketId).emit('joinRoom', { roomName });
                const soc =  await io.in(clientSocketId).fetchSockets();
                //console.log(soc)
                soc.join(roomName);
                console.log(clients)
                clients.delete(clientSocketId);
                io.emit('clientList', { mapData: Array.from(clients) });
            });
        });
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
});

const port = 3001;
http.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
