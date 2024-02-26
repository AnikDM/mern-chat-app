import Conversation from "../model/conversation.model.js";
import Message from "../model/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const { _id: senderId } = req.user._id;
        const { text } = req.body;
        const { id: receiverId } = req.params;
        if (!receiverId) return res.status(201).json({ message: "No user id provided" });

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        })
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
        }
        const newMessage = new Message({
            senderId: senderId,
            receiverId: receiverId,
            message: text
        })
        if (newMessage) {
            await newMessage.save();
            conversation.message.push(newMessage);
            await conversation.save();
        }
        const receiverSocketId= getReceiverSocketId(receiverId)
        if(receiverSocketId)
        io.to(receiverSocketId).emit("newMessage",newMessage); //send to the client side
        return res.status(201).json({ message: `Message sent successfully to ${receiverSocketId}`, newMessage, conversation });
    } catch (error) {
        return res.status(500).json({ message: error.toString() });
    }
}
export const getMessage = async (req, res) => {
    try {
        const { _id: senderId } = req.user._id;
        const { id: userToChatId } = req.params;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] }
        }).populate("message")
        return res.status(201).json(conversation);
    } catch (error) {
        return res.status(500).json({ message: error.toString() });
    }
}