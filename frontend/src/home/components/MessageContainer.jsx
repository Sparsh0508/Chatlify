import React, { useEffect, useState, useRef } from "react";
import userConversation from "../../Zustans/userConversations";
import { useAuth } from "../../context/AuthContext";
import { TiMessages } from "react-icons/ti";
import { IoArrowBackSharp, IoSend } from "react-icons/io5";
import axios from "axios";
import { useSocketContext } from "../../context/SocketContext";
import notify from "../../assets/jai_shri_ram.mp3";

const MessageContainer = ({ onBackUser }) => {
  const {
    messages,
    selectedConversation,
    setMessage,
  } = userConversation();
  const { socket } = useSocketContext();
  const { authUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendData, setSendData] = useState("");
  const lastMessageRef = useRef();

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      const sound = new Audio(notify);
      sound.play();
      setMessage([...messages, newMessage]);
    });

    return () => socket?.off("newMessage");
  }, [socket, setMessage, messages]);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef?.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const get = await axios.get(
          `/api/message/${selectedConversation?._id}`
        );
        const data = await get.data;
        if (data.success === false) {
          setLoading(false);
          console.log(data.message);
        }
        setLoading(false);
        setMessage(data);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };

    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, setMessage]);
  console.log(messages);

  const handleMessages = (e) => {
    setSendData(e.target.value);
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await axios.post(
        `/api/message/send/${selectedConversation?._id}`,
        { message: sendData }
      );
      const data = await res.data;
      if (data.success === false) {
        setSending(false);
        console.log(data.message);
      }
      setSending(false);
      setSendData("");
      setMessage([...messages, data]);
    } catch (error) {
      setSending(false);
      console.log(error);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {selectedConversation === null ? (
        <div className="flex items-center justify-center w-full h-full">
          <div
            className="px-4 text-center text-2xl font-bold flex flex-col items-center gap-4 text-base-content/70"
          >
            <p>Welcome back, {authUser.username}! 👋</p>
            <p className="text-lg font-normal">Select a conversation to start chatting.</p>
            <TiMessages className="text-6xl text-primary animate-bounce" />
          </div>
        </div>
      ) : (
        <>
          {/* Chat Header */}
          <div
            className="flex justify-between gap-1 bg-base-200/50 backdrop-blur-sm px-4 py-2 
        rounded-lg items-center shadow-sm border border-white/5 mb-2"
          >
            <div className="flex items-center gap-3 w-full">
              <div className="md:hidden">
                <button
                  onClick={() => onBackUser(true)}
                  className="btn btn-ghost btn-circle btn-sm"
                >
                  <IoArrowBackSharp size={22} />
                </button>
              </div>
              <img
                className="rounded-full w-10 h-10 object-cover border border-base-300"
                src={selectedConversation?.profilepic}
              />
              <span className="text-base-content text-lg font-bold capitalize">
                {selectedConversation?.username}
              </span>
            </div>
          </div>

          {/* Messages Section */}
          <div className="flex-1 overflow-y-auto px-2 py-2 space-y-2 scrollbar-thin scrollbar-thumb-rounded scrollbar-track-transparent">
            {loading && (
              <div className="flex w-full h-full flex-col items-center justify-center gap-4">
                <div className="loading loading-dots loading-lg text-primary"></div>
              </div>
            )}

            {!loading && messages?.length === 0 && (
              <p className="text-center text-base-content/50 mt-10">
                Send a message to start the conversation! 🚀
              </p>
            )}

            {!loading &&
              messages?.length > 0 &&
              messages?.map((message) => (
                <div key={message?._id} ref={lastMessageRef}>
                  <div
                    className={`chat ${message.senderId === authUser._id
                      ? "chat-end"
                      : "chat-start"
                      }`}
                  >
                    <div
                      className={`chat-bubble ${message.senderId === authUser._id
                        ? "chat-bubble-primary text-primary-content"
                        : "chat-bubble-secondary text-secondary-content"
                        }`}
                    >
                      {message?.message}
                    </div>
                    <div className="chat-footer opacity-50 text-xs mt-1">
                      {new Date(message?.createdAt).toLocaleTimeString("en-IN", {
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Message Input */}
          <form
            onSubmit={handelSubmit}
            className="w-full mt-2 flex items-center gap-2"
          >
            <div className="w-full relative flex items-center">
              <input
                value={sendData}
                onChange={handleMessages}
                required
                id="message"
                type="text"
                placeholder="Type a message..."
                className="input input-bordered w-full rounded-full pr-12 bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary/50 border-white/10"
              />
              <button type='submit' className="absolute right-2 btn btn-circle btn-sm btn-ghost text-primary">
                {sending ? (
                  <div className="loading loading-spinner loading-xs"></div>
                ) : (
                  <IoSend size={20} />
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default MessageContainer;
