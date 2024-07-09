import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import instance from '../../api';
import { ToastContainer, toast } from 'react-toastify';
import {jwtDecode} from 'jwt-decode';
import 'react-toastify/dist/ReactToastify.css';

const Chat = () => {
  const { inquiryID } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const decoded = jwtDecode(token);
      console.log(decoded);
      setUserID(decoded.id);
    }
    fetchMessages();
  }, [inquiryID]);

  const fetchMessages = async () => {
    try {
      const response = await instance.get(`/chat/getChatByInquiry/${inquiryID}`);
      setMessages(response.data);
      console.log(response.data);
      toast.success('Messages fetched successfully');
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to fetch messages');
    }
  };

  const handleSendMessage = async () => {
    if (!userID) {
      toast.error('User not authenticated');
      return;
    }

    try {
      await instance.post(`/chat/sendMessageByInquiry/${inquiryID}`, { SenderID: userID, Message: newMessage });
      setNewMessage('');
      fetchMessages();
      toast.success('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="p-6">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">Chat for Inquiry ID: {inquiryID}</h1>
      <div className="border border-gray-200 p-4 rounded-md mb-4">
        {messages.map((msg) => (
          <div key={msg.MessageID} className={`mb-2 chat  ${msg.SenderID === userID ? 'chat-end' : 'chat-start'}`}>
            <div className={`p-2 chat-bubble ${msg.SenderID === userID ? 'chat-bubble' : 'chat-bubble-primary'}`}>
              {msg.Message}
            </div>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="border border-gray-300 bg-white rounded-md p-2 flex-grow mr-2"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
