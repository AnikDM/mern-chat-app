import { configDotenv } from 'dotenv';
import express from 'express'
import authRouter from './routes/auth.routes.js';
import messagesRouter from './routes/message.routes.js';
import usersRouter from './routes/users.routes.js';
import connectToDatabase from './db/connectToDatabase.js';
import cookieParser from 'cookie-parser';
import path from'path';
import { app, server } from './socket/socket.js';
configDotenv();
const PORT = process.env.PORT || 3000;
const __dirname=path.resolve();
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth',authRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/users', usersRouter);
app.use(express.static(`${__dirname}/frontend/dist`));

app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"frontend","dist","index.html"));
})

server.listen(PORT, () => {
    connectToDatabase();
    console.log('Server connected ', PORT) });