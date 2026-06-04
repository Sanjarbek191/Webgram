import React, { useState, useEffect, useRef } from 'react';

function ChatWindow({ chat, userId }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Chat o'zgarsa, xabarlarni tozala
    setMessages([]);
  }, [chat.userId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;

    const messageText = inputValue;
    // Add user message
    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/ai-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: messageText,
          userId: chat.userId
        })
      });

      const data = await response.json();

      if (data.success) {
        const aiMessage = {
          id: Date.now() + 1,
          text: data.reply,
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.error || 'Xatolik yuz berdi');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: '❌ Xatolik yuz berdi. Iltimos qayta urinib ko\'ring.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="header-info">
          <div className="header-avatar">🤖</div>
          <div>
            <h2>{chat.name}</h2>
            <p className="header-status">Onlayn</p>
          </div>
        </div>
      </div>
      
      <div className="messages-container">
        {messages.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🤖</div>
            <p>Salom! Men AI assistant.</p>
            <p>Menga savol bering va men javob beraman!</p>
          </div>
        )}
        
        {messages.map(message => (
          <div key={message.id} className={`message ${message.sender}`}>
            <div className="message-content">
              <p>{message.text}</p>
              <span className="message-time">
                {message.timestamp.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="message ai">
            <div className="message-content loading">
              <span className="typing-indicator">
                <span></span><span></span><span></span>
              </span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="message-input-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Xabar yozing..."
          disabled={loading}
          autoFocus
        />
        <button type="submit" disabled={loading || !inputValue.trim()}>
          {loading ? '...' : '→'}
        </button>
      </form>
    </div>
  );
}

export default ChatWindow;