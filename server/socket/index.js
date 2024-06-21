import { createServer } from "http";
import { Server } from "socket.io";

import express from 'express';
const app = express();

import { getUserDetailsFromToken } from '../utils/getUserDetailsFromToken.js';
import { User } from "../models/user.model.js";
import { Conversation, Message } from "../models/conversation.model.js";
import { getConversation } from "../utils/GetConversation.js";

// step1: create an http server using the express app.
const server = createServer(app);

// step2: create a socket.io server using the http server.
const io = new Server(server, {

    cors: {
        // allowing requests from http://localhost:5173 (client side).
        origin: '*',

        //  to send credentials (e.g cookies) with requests.
        credentials: true
    }
});


// The onlineUser Set is used to keep track of all the online users. A Set is a data structure that stores unique values.
const onlineUser = new Set();

// step3: create an event listener for new socket connections.

// io is listening for a connection event and is triggered when a new client connects to the server.
// socket represents the connected client.
io.on('connection', async (socket) => {
    // console.log(socket);

    // On the client-side, when establishing a connection to the Socket.io server, the client sends a token as part of the connection request. On the server-side, when the Socket.io server receives the connection request, it extracts the token from socket.handshake.auth.token.
    const token = socket.handshake.auth.token;
    const user = await getUserDetailsFromToken(token);

    // Adds the socket to a room named after the user's ID, the server can later broadcast messages to all sockets in that room, allowing for efficient communication with a specific group of users.
    socket.join(user?._id.toString());

    // adding the user's ID to the onlineUser set. 
    onlineUser.add(user?._id.toString());

    // server client ko bol rha tu 'onlineUser' event pe listen kar, terko meii array of online users bhej dunga. (go to Home.jsx)
    io.emit('onlineUser', Array.from(onlineUser));
    console.log("hello there!");

    // server is listening to 'message-page' event listener, it will recive a userid from the client.
    socket.on('message-page', async (userId) => {
        const userDetails = await User.findById(userId).select("-password")

        const payload = {
            _id: userDetails?._id,
            name: userDetails?.name,
            email: userDetails?.email,
            profile_pic: userDetails?.profile_pic,
            online: onlineUser.has(userId)
        }

        // server client ko bol rha h ki tu 'message-user' pe listen kar, u ll recive a payload.
        socket.emit('message-user', payload);

        //get previous message
        const getConversationMessage = await Conversation.findOne({
            "$or": [
                { sender: user?._id, receiver: userId },
                { sender: userId, receiver: user?._id }
            ]
        }).populate('messages')

        socket.emit('message', getConversationMessage?.messages || [])
    })





    // new message
    socket.on('new-message', async (data) => {
        // console.log("new message: ", data);

        // checking inn dono users ke beech meii kabhi conversation hua h ya nhii, if yes a conversation document should exist.
        let conversation = await Conversation.findOne({
            "$or": [
                { sender: data.sender, receiver: data.receiver },
                { sender: data.receiver, receiver: data.sender }
            ]
        })

        // if conversation is not available, a new Conversation document is created
        if (!conversation) {
            const createConversation = new Conversation({
                sender: data.sender,
                receiver: data.receiver
            })
            // The saved document is assigned to the conversation variable.
            conversation = await createConversation.save();
        }

        // generate the message, a new Message document.
        const message = new Message({
            text: data.text,
            imageUrl: data.imageUrl,
            videoUrl: data.videoUrl,
            msgByUserId: data.msgByUserId,
        })
        await message.save();
        const newMessage = await Message.findById(message._id);

        // The Conversation document is updated to include the new message.
        const updateConversation = await Conversation.updateOne({ _id: conversation._id }, {
            // The "$push" operator adds the new message's _id to the messages array in the conversation.
            "$push": { messages: newMessage._id }
        })

        const getConversationMessage = await Conversation.findOne({
            "$or": [
                { sender: data.sender, receiver: data.receiver },
                { sender: data.receiver, receiver: data.sender }
            ]

            // The populate method is used to replace the messages array, which contains IDs of Message documents, with the actual Message documents themselves. (try console logging without the populate method)
        }).populate('messages')
        console.log("conversation message: ", getConversationMessage);

        // send the messages to the respective clients identified by their IDs.
        io.to(data.sender).emit('message', getConversationMessage.messages || [])
        io.to(data.receiver).emit('message', getConversationMessage.messages || [])

        // send
        const conversationSender = await getConversation(data?.sender)
        const conversationReceiver = await getConversation(data?.receiver)

        io.to(data?.sender).emit('conversation', conversationSender)
        io.to(data?.receiver).emit('conversation', conversationReceiver)

    })

    //sidebar
    socket.on('sidebar', async (currentUserId) => {
        console.log("current user ka id: ", currentUserId);

        // this function generates all the conversations of this user (iss user ki aaj tak jisse bhi baat hui h chat pe, woh saare docs) along with the no of unseen messages, last message with every user.
        const conversation = await getConversation(currentUserId);
        console.log("my conversation: ", conversation);

        socket.emit('conversation', conversation);

    })



    // When the disconnect event is triggered, we remove the user's ID from the onlineUser Set.
    socket.on('disconnect', () => {

        // Removes the user's ID from the onlineUser Set when they disconnect.
        onlineUser.delete(user?._id.toString());
        console.log('disconnect user ', socket.id);
    })
})

export { app, server };
