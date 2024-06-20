import mongoose from "mongoose";

/* 
type: mongoose.Schema.ObjectId
is used when you want to establish a relationship between two documents in different collections. For example, if you have a User collection and a Post collection, and each post is created by a user, you can store the ObjectId(_id) of the user who created the post in the Post schema.
*/
const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        default: ""
    },
    imageUrl: {
        type: String,
        default: ""
    },
    videoUrl: {
        type: String,
        default: ""
    },
    seen: {
        type: Boolean,
        default: false
    },

    // sender
    msgByUserId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
})

const ConversationSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    messages: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Message'
        }
    ]
}, { timestamps: true })

const Conversation = mongoose.model('Conversation', ConversationSchema);
const Message = mongoose.model('Message', messageSchema);

export { Conversation, Message };