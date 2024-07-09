import React, { useState, useEffect } from 'react';
import instance from '../../api';
import { ToastContainer, toast } from 'react-toastify';
import {jwtDecode} from 'jwt-decode';
import { IoDocumentAttach } from "react-icons/io5";
import 'react-toastify/dist/ReactToastify.css';

const Chat = ({ inquiryID }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userID, setUserID] = useState(null);
  const [file, setFile] = useState(null);
  const [upload, setUpload] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const decoded = jwtDecode(token);
      setUserID(decoded.id);
    }
    fetchMessages();
  }, [inquiryID]);

  const fetchMessages = async () => {
    try {
      const response = await instance.get(`/chat/getChatByInquiry/${inquiryID}`);
      setMessages(response.data);
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
    if(newMessage === ''){
      toast.error('Enter a Message to send');
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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    setUpload(true);
  };

  const handleFileUpload = async () => {
    if (!userID) {
      toast.error('User not authenticated');
      return;
    }

    const formData = new FormData();
    formData.append('SenderID', userID);
    if (file) {
      formData.append('file', file);
    }else{
      toast.error('Upload a File');
      return;
    }

    try {
      await instance.post(`/chat/sendFileByInquiry/${inquiryID}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setNewMessage('');
      setFile(null);
      setUpload(false);
      fetchMessages();
      toast.success('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    }
  };

  const getFileNameFromUrl = (url) => {
    const urlObject = new URL(url);
    const pathName = urlObject.pathname;
    const fileName = pathName.substring(pathName.lastIndexOf('/') + 1);
    return fileName;
  };

  return (
    <div className="p-6">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6">Chat for Inquiry ID: {inquiryID}</h1>
      <div className="border border-gray-200 p-4 rounded-md mb-4 h-64 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.MessageID} className={`mb-2 chat ${msg.SenderID === userID ? 'chat-end' : 'chat-start'}`}>
            <div className={`p-2 rounded-md ${msg.SenderID === userID ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
              {msg.Type === 'file' ? (
                <a href={`http://localhost:3001/${msg.Message}`} target='_blank' download className=" underline">
                  {getFileNameFromUrl(`http://localhost:3001/${msg.Message}`)}
                </a>
              ) : (
                msg.Message
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex">
        {upload ? (
          <>
            <input
              type="file"
              onChange={handleFileChange}
              className="file-input file-input-bordered file-input-info w-full max-w-xs ml-2"
            />
            <button className="p-2 ml-2 btn btn-active btn-primary" onClick={handleFileUpload}>
              Upload
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="border border-gray-300 bg-white rounded-md p-2 flex-grow mr-2"
              placeholder="Type your message"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Send
            </button>
            <button
              className="btn btn-active btn-accent ml-2"
              onClick={handleUpload}
            >
              <IoDocumentAttach />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
