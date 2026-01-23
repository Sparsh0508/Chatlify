import Sidebar from "./components/Sidebar.jsx";
import MessageContainer from "./components/MessageContainer.jsx";
import React, { useState } from 'react';




const Home = () => {

  const [selectedUser, setSelectedUser] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const handelUserSelect = (user) => {
    setSelectedUser(user);
    setIsSidebarVisible(false);
  }
  const handelShowSidebar = () => {
    setIsSidebarVisible(true);
    setSelectedUser(null);
  }

  return (
    <div
      className="flex justify-between w-full md:min-w-[750px] md:max-w-[80%] px-4 h-[90%] md:h-[90%] rounded-xl shadow-2xl bg-base-100/30 backdrop-blur-lg border border-white/10"
    >
      {/* Sidebar */}
      <div
        className={`w-full md:w-[350px] py-4 md:flex flex-col ${isSidebarVisible ? "" : "hidden"} border-r border-white/10 pr-2`}
      >
        <Sidebar onSelectUser={handelUserSelect} />
      </div>

      {/* Divider (only show when sidebar & user selected) */}
      {/* Divider is removed as we use border-r on sidebar */}

      {/* Message container */}
      <div
        className={`flex-auto ${selectedUser ? "flex" : "hidden md:flex"
          } pl-2`}
      >
        <MessageContainer onBackUser={handelShowSidebar} />
      </div>
    </div>

  );
};

export default Home;
Home;
