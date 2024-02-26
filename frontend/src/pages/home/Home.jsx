import toast from "react-hot-toast";
import Conversation from "./Conversation";
import Messages from "./Messages";
import { IoSend, IoLogOut } from "react-icons/io5";
import { useAuthContext } from "../../context/AuthContext";
import { useEffect, useRef, useState } from "react";
import useConversation from "../../zustand/useConversation";
import { useSocketContext } from "../../context/SocketContext";
const Home = () => {
  const { authUser, setAuthUser } = useAuthContext();
  const { socket,onlineUsers } = useSocketContext();
  const messagesContainerRef = useRef(null);
  const [allusers, setAllUser] = useState([]);
  const [text, setText] = useState();
  const { selectedConversation } = useConversation();
  const {messages,setMessages}=useConversation();
  const [cnt,setCnt]=useState(0);
  const handleUser = async () => {
    if (authUser) {
      const res = await fetch("/api/users/");
      let data = await res.json();
      setAllUser(data);
    }
  };
  useEffect(() => {
    handleUser();
  }, []);

  async function handleSend(e) {
    e.preventDefault();
    if(text){
    const res=await fetch(`api/messages/send/${selectedConversation._id}`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text,
    })})
    const data = await res.json();
    setMessages([...messages,data.newMessage]);
    setText("");}
  }
  useEffect(()=>{
    socket?.on("newMessage",(newMessage)=>{
      setMessages([...messages,newMessage])
      return ()=>socket.off("newMessage")
    })
  },[socket,setMessages,messages])
  useEffect(() => {
    // Scroll to the bottom of the messages container whenever messages change
    scrollToBottom();
    if(cnt===0)
      setCnt(cnt+1)
  }, [messages]);
  useEffect(()=>setCnt(0),[selectedConversation])
  const scrollToBottom = () => {
    // Scroll to the bottom of the messages container
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior:cnt>0?'smooth':'instant'
      });
    }
  };
  async function handleLogout(e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      toast.success("Logged Out Successfully");
      localStorage.removeItem("chat-user");
      setAuthUser(null);
    } catch (error) {
      toast.error(error.message);
    }
  }
  return (
    <div className="rounded-2xl bg-white/5 shadow-lg h-full  w-full backdrop-blur-md flex overflow-hidden max-sm:">
      <div className="w-1/3 sm:p-3 max-sm:py-2 relative max-sm:w-1/5 max-sm:absolute z-10 max-sm:left-0 max-sm:bg-base-100 h-full">
        <div className="card card-side bg-base-100 shadow-xl px-2 sm:mb-2 max-sm:items-center max-sm:flex-col">
          <figure className="w-10">
            <img src={authUser.profilePic} alt="Movie" />
          </figure>
          <div className="card-body p-3">
            <h2 className="card-title max-sm:text-sm text-primary">
              {authUser.fullname || authUser.username}
            </h2>
          </div>
        </div>
        <label className="input input-bordered flex items-center rounded-2xl gap-2 mb-5 max-sm:hidden">
          <input type="text" className="grow" placeholder="Search" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
        <div className="divider max-sm:m-0"></div>
        <div className="sm:pt-5 pt-2 max-h-[500px] overflow-auto">
          {allusers.map((item) => {
            return (
              <>
                <Conversation key={item._id} item={item} isOnline={onlineUsers.find((user)=>user===item._id)}/>
              </>
            );
          })}
        </div>
        <div className="absolute bottom-2 max-sm:left-[calc(50%-26px)]">
          <button onClick={(e) => handleLogout(e)} className="btn btn-primary rounded-2xl">
            <IoLogOut className="text-xl" />
          </button>
        </div>
      </div>
      <div className=" flex-1 border-s border-s-white/5 relative max-sm:ms-[20%]">
        {!selectedConversation ? (
          <div className="flex items-center h-full justify-center font-semibold text-2xl text-center max-sm:text-3xl"><span>Welcome To Chat<span className="text-primary text-4xl ms-2">{authUser.fullname}</span></span></div>
        ) : (
          <>
            <div className="bg-white/5 font-semibold text-md p-2">
              To: {selectedConversation?.fullname} <span className="sm:hidden">{onlineUsers.find((user)=>user===selectedConversation._id)?(<span className="text-xs font-thin text-success italic">Online</span>):(<span className="text-xs font-thin text-end text-error italic">Offline</span>)}</span>
            </div>
            <div className="p-5 max-h-[calc(100vh-8rem)] overflow-auto w-full" id="chatbox" ref={messagesContainerRef}>
              {!messages==[]?(messages?.map(item=>{return (<><Messages messages={item} /></>)
              })):(<div className="text-center">Send message to start the conversation</div>)}
            </div>
            <div className="w-full p-2 absolute bottom-0">
              <form
                action=""
                className="form-control"
                onSubmit={(e) => handleSend(e)}
              >
                <label className="input input-bordered pe-0 flex items-center rounded-2xl">
                  <input type="text" className="flex-1 overflow-auto" placeholder="Search" value={text} onChange={e=>setText(e.target.value)}/>
                  <button className="btn btn-primary rounded-2xl absolute right-2" type="submit">
                    <IoSend className=" cursor-pointer" />
                  </button>
                </label>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
