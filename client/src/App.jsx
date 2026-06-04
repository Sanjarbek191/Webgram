import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';

function App() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [userId] = useState(`user_${Math.random().toString(36).substr(2, 9)}`);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/conversations');
      const data = await response.json();
      setChats(data);
      if (data.length > 0) {
        setSelectedChat(data[0]);
      }
    } catch (error) {
      console.error('Failed to load chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    const newChat = {
      userId: `user_${Math.random().toString(36).substr(2, 9)}`,
      name: `AI Assistant ${chats.length + 1}`
    };
    setChats([...chats, newChat]);
    setSelectedChat(newChat);
  };

  const handleDeleteChat = async (chatId) => {
    try {
      await fetch(`http://localhost:5000/api/conversations/${chatId}`, {
        method: 'DELETE'
      });
      setChats(chats.filter(chat => chat.userId !== chatId));
      if (selectedChat?.userId === chatId) {
        setSelectedChat(chats[0] || null);
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  };

  if (loading) {
    return (
      <div className="webgram-container loading-state">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="webgram-container">
      <ChatList 
        chats={chats} 
        selectedChat={selectedChat}
        onSelectChat={setSelectedChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
      />
      {selectedChat ? (
        <ChatWindow 
          chat={selectedChat}
          userId={userId}
        />
      ) : (
        <div className="empty-app-state">
          <h1>👋 Webgram-ga xush kelibsiz!</h1>
          <p>Yangi chat yaratish uchun + tugmasini bosing</p>
        </div>
      )}
    </div>
  );
}

export default App;