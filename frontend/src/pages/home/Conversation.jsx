import { useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
import useConversation from "../../zustand/useConversation";

const Conversation = ({activeChat="user-hover-active",item,isOnline}) => {
  const {selectedConversation,setSelectedConversation}=useConversation();
  const {authUser} = useAuthContext();
  const {setMessages}=useConversation();
  const getMessage=async()=>{
      const res=await fetch(`api/messages/send/${selectedConversation?._id}`)
      const data=await res.json();
      setMessages(data?.message)
  }
  useEffect(()=>{
    if(authUser && selectedConversation?._id)
      getMessage();
  },[selectedConversation?._id])
  if(selectedConversation?._id===item._id)
    activeChat="user-active"
  return (
    <div onClick={()=>{(selectedConversation?._id!=item._id?setMessages([]):'');setSelectedConversation(item)}} className={`flex items-center max-sm:justify-center ${activeChat} text-content sm:p-3 max-sm:mb-2 sm:border-b border-white/5 cursor-pointer`} >
      <div className={`w-12 sm:me-5 avatar max-sm:m-1 ${isOnline?'online':''}`}>
        <img
          className={`sm:object-contain rounded-full ${activeChat==="user-active"?"user-active-sm":''}`}
          src={item.profilePic}
          alt=""
        />
      </div>
      <p className="font-bold max-sm:text-xs max-sm:hidden">{item.fullname}</p>
    </div>
  );
};

export default Conversation;
