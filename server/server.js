const express = require('express');
const cors = require('cors')
const app = express();
const app2=express();
const http = require('http').createServer(app);
const { ExpressPeerServer } = require('peer');
const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use(cors())
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
        socket.on('createRoom', async ({ clientArray }) => {
            console.log('Creating room');
            const roomName = `room${Math.random().toString(36).substr(2, 9)}`;

            await Promise.all(clientArray.map(async (client) => {
                const clientSocketId = Array.from(clients.keys()).find(
                    (key) => clients.get(key) === client
                );
                const soc = await io.in(clientSocketId).fetchSockets();

                soc[0].join(roomName);
                clients.delete(clientSocketId);
                io.emit('clientList', { mapData: Array.from(clients) });
            }));

            //const roomClients = io.sockets.adapter.rooms.get(roomName);

            io.in(roomName).emit('renderRoom',roomName);
        });

        socket.on('peerID', (peerID,roomName) => {
            console.log('connected client peer id:',peerID);
            socket.to(roomName).emit('clientPeerID', peerID);
        })
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
});

const port = 3001;
http.listen(port, () => {
    console.log(`Server started on port ${port}`);
});



const pjs=app2.listen(3002)
const peerServer = ExpressPeerServer(pjs);
app2.use("/peerjs", peerServer);