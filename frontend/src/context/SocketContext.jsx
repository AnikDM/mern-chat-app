import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client"
export const SocketContext=createContext();
export const useSocketContext=()=>useContext(SocketContext);
export const SocketContextProvider=({children})=>{
    const [socket,setSocket]=useState(null)
    const [onlineUsers,setonlineUsers]=useState([])
    const {authUser}=useAuthContext();

    useEffect(()=>{
        if(authUser){
            const socket=io("https://mern-chat-app-4e9x.onrender.com",{
                query:{
                    userId: authUser._id
                }
            })
            socket.on('getOnlineUsers', (users)=>{
                setonlineUsers(users)
            })
            setSocket(socket)
            
            return ()=>socket.close();
        }
        else{
            if(socket){
                socket.close();
                setSocket(null)
            }
        }
    },[authUser])
return <SocketContext.Provider value={{socket,onlineUsers}}>
    {children}
</SocketContext.Provider>
}