import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useChatContext } from '../../Context/ChatContext';
import './chat.css';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { chatInfo } = useChatContext();
  const [forceUpdate, setForceUpdate] = useState(false);
  // const socket = io('http://localhost:5000');
  const socket = io('https://rb-pfj6.onrender.com');
  const chatContainerRef = useRef();

  useEffect(() => {
    if (chatInfo.roomId && chatInfo.loggedInUserId) {
      socket.emit('getRoomMessages', chatInfo.roomId);
      socket.on('roomMessages', handleReceivedMessages);
      socket.on('ReceivedMessage', handleReceivedMessage);
    }

    return () => {
      socket.off('roomMessages', handleReceivedMessages);
      socket.off('ReceivedMessage', handleReceivedMessage);
    };
  }, [chatInfo.roomId, chatInfo.loggedInUserId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, []);

  const handleReceivedMessages = (data) => {
    setMessages((prevMessages) => [...prevMessages, ...data.messages]);
    setForceUpdate((prev) => !prev);
  };

  const handleReceivedMessage = (data) => {
    setMessages((prevMessages) => [...prevMessages, ...data.messages]);
    setForceUpdate((prev) => !prev);
  };

  const sendMessage = () => {
    if (message.trim() === '') return;

    const newMessage = {
      senderId: chatInfo.loggedInUserId,
      message: message.trim(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    socket.emit('SendMessage', {
      roomId: chatInfo.roomId,
      senderId: chatInfo.loggedInUserId,
      message: message.trim(),
    });

    setMessage('');
  };

  return (
    <div key={forceUpdate} className="chat-container" ref={chatContainerRef}>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={msg.senderId === chatInfo.loggedInUserId ? 'sent' : 'received'}>
            <p>{msg.message}</p>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;