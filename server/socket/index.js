import { createServer } from "http";
import { Server } from "socket.io";

import express from 'express';
const app = express();

import { getUserDetailsFromToken } from '../utils/getUserDetailsFromToken.js';

// step1: create an http server using the express app.
const server = createServer(app);

// step2: create a socket.io server using the http server.
const io = new Server(server, {

    cors: {
        // allowing requests from http://localhost:5173 (client side).
        origin: 'http://localhost:5173',

        //  to send credentials (e.g cookies) with requests.
        credentials: true
    }
});


// The onlineUser Set is used to keep track of all the online users. A Set is a data structure that stores unique values.
const onlineUser = new Set();

// step3: create an event listener for new socket connections.

// io.on('connection') is an event listener that listens for the connection event on the Socket.io server instance io and is triggered when a new client connects to the server.
// socket represents the connected client.
io.on('connection', async (socket) => {
    console.log(socket);

    // On the client-side, when establishing a connection to the Socket.io server, the client sends a token as part of the connection request. On the server-side, when the Socket.io server receives the connection request, it extracts the token from socket.handshake.auth.token.
    const token = socket.handshake.auth.token;
    const user = await getUserDetailsFromToken(token);

    // Adds the socket to a room named after the user's ID, the server can later broadcast messages to all sockets in that room, allowing for efficient communication with a specific group of users.
    socket.join(user?._id);

    // adding the user's ID to the onlineUser set. 
    onlineUser.add(user?._id);

    // emit is a method that allows the server to send an event to one or more connected clients.
    // io.emit('onlineUser') is emitting a custom event named onlineUser from the server-side to all the connected clients.
    // the server can push updates to connected clients in real-time, the clients can listen for these events to receive the updated data.
    io.emit('onlineUser', Array.from(onlineUser))


    // When the disconnect event is triggered, we remove the user's ID from the onlineUser Set.
    socket.on('disconnect', () => {

        // Removes the user's ID from the onlineUser Set when they disconnect.
        onlineUser.delete(user?._id)
        console.log('disconnect user ', socket.id);
    })
})

export { app, server };
