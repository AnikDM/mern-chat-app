import { Server } from "socket.io";
import http from "http";
import express from "express";
const app = express();
const server= new http.createServer(app);
const io = new Server(server,{
  cors: { origin:"*", methods:["GET","POST"],transports: ['websocket'],
  allowEIO3: true}
})
 const userSocketMap={} //{userId:socket.id}

 export const getReceiverSocketId=(receiverId)=>{
  return  userSocketMap[receiverId]||null;
 }
 io.on("connection", (socket) => {
    const userId= socket.handshake['query']['userId'];
   console.log(`User connected with id ${userId}`);
   if(userId!='undefined') userSocketMap[userId]=socket.id;
    io.emit("getOnlineUsers",Object.keys(userSocketMap))
   console.log(userSocketMap)
    socket.on('disconnect', ()=>{
      console.log(`user disconnected ${socket.id}`);
      delete userSocketMap[userId]
      io.emit("getOnlineUsers",Object.keys(userSocketMap))
     });

   //send message to all clients except the sender
   socket.on("sendMessage", (message,room)=>{
       console.log(message);
        if(!room){
          return;
         }
       socket.to(room).emit("getMessage",`${socket.id}: ${message}`);
   });
 })
export {app,io,server};