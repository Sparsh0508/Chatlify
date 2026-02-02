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

  const lastMessageRef = useRef(null);

  /* Socket listener */
  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      const sound = new Audio(notify);
      sound.play();
      setMessage((prev) => [...prev, newMessage]);
    });

    return () => socket?.off("newMessage");
  }, [socket, setMessage]);

  /* Auto scroll */
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* Fetch messages */
  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `/api/message/${selectedConversation?._id}`
        );
        setMessage(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, setMessage]);

  const handelSubmit = async (e) => {
    e.preventDefault();
    if (!sendData.trim()) return;

    setSending(true);
    try {
      const res = await axios.post(
        `/api/message/send/${selectedConversation?._id}`,
        { message: sendData }
      );
      setMessage((prev) => [...prev, res.data]);
      setSendData("");
    } catch (err) {
      console.log(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {selectedConversation === null ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="px-4 text-center text-2xl font-bold flex flex-col items-center gap-4 text-base-content/70">
            <p>Welcome back, {authUser.username}!</p>
            <p className="text-lg font-normal">
              Select a conversation to start chatting.
            </p>
            <TiMessages className="text-6xl text-primary animate-bounce" />
          </div>
        </div>
      ) : (
        <>
          {/* Header (FIXED) */}
          <div className="shrink-0 flex items-center gap-3 bg-base-200/50 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-white/5">
            <button
              onClick={onBackUser}
              className="md:hidden btn btn-ghost btn-circle btn-sm"
            >
              <IoArrowBackSharp size={22} />
            </button>

            <img
              src={selectedConversation?.profilepic}
              className="w-10 h-10 rounded-full object-cover border"
            />

            <span className="text-lg font-bold capitalize">
              {selectedConversation?.username}
            </span>
          </div>

          {/* Messages (ONLY THIS SCROLLS) */}
          <div className="flex-1 overflow-y-auto px-2 py-2 space-y-2 scrollbar-thin">
            {loading && (
              <div className="flex h-full items-center justify-center">
                <div className="loading loading-dots loading-lg text-primary"></div>
              </div>
            )}

            {!loading && (Array.isArray(messages) ? messages.length : 0) === 0 && (
              <p className="text-center text-base-content/50 mt-10">
                Send a message to start the conversation!
              </p>
            )}

            {Array.isArray(messages) && messages.map((message) => (
              <div key={message._id} ref={lastMessageRef}>
                <div
                  className={`chat ${message.senderId === authUser._id
                    ? "chat-end"
                    : "chat-start"
                    }`}
                >
                  <div
                    className={`chat-bubble ${message.senderId === authUser._id
                      ? "chat-bubble-primary"
                      : "chat-bubble-secondary"
                      }`}
                  >
                    {message.message}
                  </div>
                  <div className="chat-footer text-xs opacity-50">
                    {new Date(message.createdAt).toLocaleTimeString("en-IN", {
                      hour: "numeric",
                      minute: "numeric",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input (FIXED) */}
          <form
            onSubmit={handelSubmit}
            className="shrink-0 w-full flex items-center gap-2 px-2 py-2"
          >
            <div className="w-full relative">
              <input
                value={sendData}
                onChange={(e) => setSendData(e.target.value)}
                required
                type="text"
                placeholder="Type a message..."
                className="input input-bordered w-full rounded-full pr-12"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-circle btn-sm btn-ghost text-primary"
              >
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
