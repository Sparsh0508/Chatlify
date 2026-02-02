import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import axios from 'axios';
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom'
import { IoArrowBackSharp } from 'react-icons/io5';
import { BiLogOut } from "react-icons/bi";
import userConversation from '../../Zustans/userConversations.js';
import { useSocketContext } from '../../context/SocketContext';

const Sidebar = ({ onSelectUser }) => {

  const navigate = useNavigate();
  const { authUser, setAuthUser } = useAuth();
  const [searchInput, setSearchInput] = useState('');
  const [searchUser, setSearchuser] = useState([]);
  const [chatUser, setChatUser] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedUserId, setSetSelectedUserId] = useState(null);
  const [newMessageUsers, setNewMessageUsers] = useState('');
  const { setSelectedConversation } = userConversation();
  const { onlineUsers, socket } = useSocketContext();
  const nowOnline = (chatUser || []).map((user) => (user._id));
  const isOnline = (nowOnline || []).map(userId => (onlineUsers || []).includes(userId));

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      setNewMessageUsers(newMessage);

      // If the user is not already in chatUser, fetch chatUser list again
      const exists = chatUser.some(u => u._id === newMessage.senderId || u._id === newMessage.reciverId);
      if (!exists) {
        fetchChatUsers();
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, chatUser]);

  // extract fetch function so it can be reused
  const fetchChatUsers = async () => {
    setLoading(true);
    try {
      const chatters = await axios.get(`/api/user/currentchatters`);
      const data = chatters.data;
      if (data.success !== false) {
        setChatUser(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatUsers();
  }, []);


  //show user from the search result
  const handelSearchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const search = await axios.get(`/api/user/search?search=${searchInput}`);
      const data = search.data;
      if (data.success === false) {
        setLoading(false)
        console.log(data.message);
      }
      setLoading(false)
      if (data.length === 0) {
        toast.info("User Not Found")
      } else {
        setSearchuser(data)
      }
    } catch (error) {
      setLoading(false)
      console.log(error);
    }
  }

  //show which user is selected
  const handelUserClick = (user) => {
    onSelectUser(user);
    setSelectedConversation(user);
    setSetSelectedUserId(user._id);
    setNewMessageUsers('')
  }

  //back from search result
  const handSearchback = () => {
    setSearchuser([]);
    setSearchInput('')
  }

  //logout
  const handelLogOut = async () => {

    const confirmlogout = window.prompt("type 'UserName' To LOGOUT");
    if (confirmlogout === authUser.username) {
      setLoading(true)
      try {
        const logout = await axios.post('/api/auth/logout')
        const data = logout.data;
        if (data?.success === false) {
          setLoading(false)
          console.log(data?.message);
        }
        toast.info(data?.message)
        localStorage.removeItem('chatapp')
        setAuthUser(null)
        setLoading(false)
        navigate('/login')
      } catch (error) {
        setLoading(false)
        console.log(error);
      }
    } else {
      toast.info("LogOut Cancelled")
    }

  }

  return (
    <div className="h-full w-full flex flex-col">
      {/* Search + Profile */}
      <div className="flex justify-between items-center gap-2 mb-4">
        <form
          onSubmit={handelSearchSubmit}
          className="flex items-center bg-base-200/50 rounded-full px-3 w-full border border-white/10 focus-within:ring-2 ring-primary/50 transition-all"
        >
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            className="px-2 py-2 w-full bg-transparent outline-none text-base-content placeholder-base-content/50"
            placeholder="Search user..."
          />
          <button
            type="submit"
            className="btn btn-ghost btn-xs btn-circle text-primary"
          >
            <FaSearch size={16} />
          </button>
        </form>

        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar online">
            <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img alt="Profile" src={authUser?.profilepic} />
            </div>
          </div>
        </div>
      </div>

      <div className="divider my-0 h-0.5 bg-white/10"></div>

      {/* Search Results */}
      {searchUser?.length > 0 ? (
        <>
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-track-transparent">
            {searchUser.map((user, index) => (
              <div key={user._id} className="mt-2">
                <div
                  onClick={() => handelUserClick(user)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300
                hover:bg-primary/10 ${selectedUserId === user?._id ? "bg-primary text-primary-content" : "text-base-content"
                    }`}
                >
                  {/* Online Status */}
                  <div className={`avatar ${isOnline[index] ? "online" : ""}`}>
                    <div className="w-10 h-10 rounded-full bg-base-300">
                      <img src={user.profilepic} alt="user" />
                    </div>
                  </div>
                  <div className="flex flex-col flex-1">
                    <p className="font-medium text-lg capitalize">{user.username}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Back Button */}
          <div className="mt-2 flex justify-center">
            <button
              onClick={handSearchback}
              className="btn btn-circle btn-ghost"
            >
              <IoArrowBackSharp size={24} />
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Default Chat User List */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-track-transparent my-2">
            {chatUser.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-base-content/50 font-medium text-lg mt-10">
                <p>No chats yet! 🤷‍♂️</p>
                <p className="text-sm">Search for a user to start.</p>
              </div>
            ) : (
              chatUser.map((user, index) => (
                <div key={user._id} className="mb-1">
                  <div
                    onClick={() => handelUserClick(user)}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-primary/10 
                  ${selectedUserId === user?._id ? "bg-primary text-primary-content shadow-lg" : "text-base-content"}`}
                  >
                    {/* Online Status */}
                    <div className={`avatar ${isOnline[index] ? "online" : "offline"}`}>
                      <div className="w-12 h-12 rounded-full border-2 border-base-100">
                        <img src={user.profilepic} alt="user" />
                      </div>
                    </div>

                    <div className="flex flex-col flex-1">
                      <p className="font-semibold text-base capitalize">{user.username}</p>
                    </div>

                    {/* New Message Indicator */}
                    {newMessageUsers.reciverId === authUser._id &&
                      newMessageUsers.senderId === user._id ? (
                      <div className="badge badge-secondary badge-xs">
                        New
                      </div>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Logout */}
          <div className="mt-auto pt-2 border-t border-white/10">
            <button
              onClick={handelLogOut}
              className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-error/10 text-error transition-all"
            >
              <BiLogOut size={22} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Sidebar