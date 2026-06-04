import React from 'react';

function ChatList({ chats, selectedChat, onSelectChat, onNewChat, onDeleteChat }) {
  return (
    <div className="chat-list">
      <div className="chat-list-header">
        <h1>Webgram</h1>
        <button className="new-chat-btn" onClick={onNewChat} title="Yangi chat yaratish">+</button>
      </div>
      
      <div className="chat-list-items">
        {chats.length === 0 ? (
          <div className="empty-chats">
            <p>Chat yo'q</p>
            <p className="small-text">Yangi chat yaratish uchun + bosing</p>
          </div>
        ) : (
          chats.map(chat => (
            <div
              key={chat.userId}
              className={`chat-item ${selectedChat?.userId === chat.userId ? 'active' : ''}`}
              onClick={() => onSelectChat(chat)}
            >
              <div className="chat-avatar">
                <span className="avatar-icon">🤖</span>
              </div>
              <div className="chat-info">
                <p className="chat-name">{chat.name}</p>
                <p className="chat-preview">AI Assistant</p>
              </div>
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.userId);
                }}
                title="O'chirish"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ChatList;