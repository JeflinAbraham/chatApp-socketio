import { Conversation } from "../models/conversation.model.js"

export const getConversation = async(currentUserId)=>{
    if(currentUserId){

        // we ll find all the conversations/chats of this user.
        const currentUserConversation = await Conversation.find({
            "$or" : [
                { sender : currentUserId },
                { receiver : currentUserId}
            ]
        }).sort({  updatedAt : -1 }).populate('sender').populate('receiver').populate('messages');



        const conversation = currentUserConversation.map((conv)=>{
            // conv(Conversation document) is an object containing populated values of sender, receiver, messages.

            const countUnseenMsg = conv.messages.reduce((prev,curr) => {
                // conv.messages is an array contating Message documents.
                // prev is a counter value initialized to 0.
                // curr is the current iteration ka Message document.

                // if the current message(curr) was sent by someone else, not the current user.
                if(curr.msgByUserId.toString() !== currentUserId){
                    // increment the prev value by 1 if the message has not been seen.
                    return  prev + (curr.seen ? 0 : 1)
                }
                else{
                    return prev
                }
             
            },0)

            return{
                _id : conv._id,
                sender : conv.sender,
                receiver : conv.receiver,
                unseenMsg : countUnseenMsg,
                lastMsg : conv.messages[conv.messages.length - 1]
            }
        })

        return conversation
    }else{
        return []
    }
}