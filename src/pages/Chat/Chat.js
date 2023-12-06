import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useChatContext } from '../../Context/ChatContext';

const socket = io.connect(process.env.REACT_APP_BACKEND_URL);

const Chat = () => {
  const { chatInfo } = useChatContext();
  const { roomId, loggedInUserId } = chatInfo;
  const [message, setMessage] = useState('');
  const [roomMessages, setRoomMessages] = useState([]);
  const URL = process.env.REACT_APP_BACKEND_URL;
  console.log('ChatInfo:', chatInfo);
  useEffect(() => {
    // Fetch chat messages for the current room when the component mounts
    const fetchChatMessages = async () => {
      try {
        const response = await axios.post(`${URL}/api/users/getChatMessages/${ roomId }` );
        console.log('Chat messages:', response.data.messages);

        console.log('Chat messages:', response.data.messages);
        setRoomMessages(response.data.messages);
      } catch (error) {
        console.error('Error fetching chat messages:', error);
      }
    };

    fetchChatMessages();

    // Listen for new messages from the server
    socket.on('ReceivedMessage', (data) => {
      setRoomMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off('ReceivedMessage');
    };
  }, [roomId]);

  const sendMessage = () => {
    if (message.trim() !== '') {
      const messageData = {
        roomId,
        senderId: loggedInUserId,
        message,
      };
  
      // Log the emitted message
      console.log('Emitting Message:', messageData);
  
      // Emit the message to the server
      socket.emit('SendMessage', messageData);

      // Update the local state
      setRoomMessages((prevMessages) => [...prevMessages, messageData]);
      setMessage('');
    }
  };
  
  return (
    <div>
      <div>
        {roomMessages.map((message, index) => (
          <div key={index}>
            {message.senderId === loggedInUserId ? (
              <div style={{ textAlign: 'right', color: 'blue' }}>
                {message.message}
              </div>
            ) : (
              <div style={{ textAlign: 'left', color: 'green' }}>
                {message.message}
              </div>
            )}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
