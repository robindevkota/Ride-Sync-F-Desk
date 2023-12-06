// ChatContext.js
import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chatInfo, setChatInfo] = useState({ roomId: null, loggedInUserId: null });

  const setChatContext = (roomId, loggedInUserId) => {
    setChatInfo({ roomId, loggedInUserId });
  };

  return (
    <ChatContext.Provider value={{ chatInfo, setChatContext }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};
