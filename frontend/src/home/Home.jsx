import Sidebar from "./components/Sidebar.jsx";
import MessageContainer from "./components/MessageContainer.jsx";
import React, { useState } from "react";

const Home = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setIsSidebarVisible(false);
  };

  const handleShowSidebar = () => {
    setIsSidebarVisible(true);
    setSelectedUser(null);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">

      {/* App Header (FIXED HEIGHT) */}
      <header className="shrink-0 h-14 flex items-center justify-center border-b border-white/10">
        <h1 className="text-xl font-bold">Hi, I am Your Chat App</h1>
      </header>

      {/* Chat Layout */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex w-full md:min-w-[750px] md:max-w-[80%] h-full px-4 rounded-xl shadow-2xl bg-base-100/30 backdrop-blur-lg border border-white/10">

          {/* Sidebar */}
          <div
            className={`w-full md:w-[350px] py-4 md:flex flex-col ${
              isSidebarVisible ? "" : "hidden"
            } border-r border-white/10 pr-2 h-full`}
          >
            <Sidebar onSelectUser={handleUserSelect} />
          </div>

          {/* Message Container */}
          <div
            className={`flex-1 ${
              selectedUser ? "flex" : "hidden md:flex"
            } pl-2 h-full`}
          >
            <MessageContainer onBackUser={handleShowSidebar} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;
