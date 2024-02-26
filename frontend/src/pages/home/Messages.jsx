import { useAuthContext } from "../../context/AuthContext";
import useConversation from "../../zustand/useConversation";

const Messages = ({ messages = null }) => {
  const { selectedConversation } = useConversation();
  const { authUser } = useAuthContext();
  const isSender = messages.senderId === authUser._id;
  const timestamp = messages.createdAt;
  const date = new Date(timestamp);
  const hours = padZero(date.getHours());
  const minutes =padZero(date.getMinutes());
  function padZero(number){
    return number.toString().padStart(2,"0");
  }
  return (
    <>
      <div
        className={`chat ${isSender ? "chat-end" : "chat-start"} animate-popup`}
      >
        <div className="chat-image avatar">
          <div className="w-10 max-sm:w-8 rounded-full">
            <img
              alt="Tailwind CSS chat bubble component"
              src={
                isSender ? authUser.profilePic : selectedConversation.profilePic
              }
            />
          </div>
        </div>
        <div className="chat-header max-sm:text-[.5rem]">
          {/* {isSender?"You":selectedConversation.fullname} */}
        </div>
        <div
          className={` chat-bubble min-h-1 ${
            isSender ? "chat-bubble-primary" : ""
          }`}
        >
          {messages?.message}
        </div>
        <time className="text-xs opacity-50 ">{`${hours}:${minutes}`}</time>
        {/* <div className="chat-footer opacity-50 max-sm:text-[.5rem]">Delivered</div> */}
      </div>
    </>
  );
};

export default Messages;
