// Global variables
let chats = [];
let selectedChatId = null;
let currentUserId = `user_${Math.random().toString(36).substr(2, 9)}`;
const API_URL = 'http://localhost:5000/api';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadChats();
});

// Load all chats from backend
async function loadChats() {
    try {
        const response = await fetch(`${API_URL}/conversations`);
        if (!response.ok) throw new Error('Failed to load chats');
        
        chats = await response.json();
        renderChatsList();
    } catch (error) {
        console.error('Error loading chats:', error);
        showNotification('Suhbatlarni yuklab olishda xato', 'error');
    }
}

// Render chats list
function renderChatsList() {
    const chatsList = document.getElementById('chatsList');
    chatsList.innerHTML = '';

    if (chats.length === 0) {
        chatsList.innerHTML = '<div style="padding: 20px; color: #95a5a6; text-align: center;">Hali suhbat yo\'q</div>';
        return;
    }

    chats.forEach(chat => {
        const chatEl = document.createElement('div');
        chatEl.className = `chat-item ${chat.userId === selectedChatId ? 'active' : ''}`;
        chatEl.innerHTML = `
            <span class="chat-item-name">${chat.name}</span>
            <button class="chat-item-delete" onclick="deleteChat('${chat.userId}', event)">🗑️</button>
        `;
        chatEl.addEventListener('click', (e) => {
            if (!e.target.classList.contains('chat-item-delete')) {
                selectChat(chat.userId);
            }
        });
        chatsList.appendChild(chatEl);
    });
}

// Create new chat
function createNewChat() {
    const newChat = {
        userId: `user_${Math.random().toString(36).substr(2, 9)}`,
        name: `AI Assistant ${chats.length + 1}`
    };
    chats.push(newChat);
    renderChatsList();
    selectChat(newChat.userId);
    showNotification('Yangi chat yaratildi ✅', 'success');
}

// Select a chat
function selectChat(chatId) {
    selectedChatId = chatId;
    currentUserId = chatId;
    renderChatsList();
    updateChatHeader();
    clearMessages();
    enableInputs();
}

// Update chat header
function updateChatHeader() {
    const chatHeader = document.getElementById('chatHeader');
    if (selectedChatId) {
        const chat = chats.find(c => c.userId === selectedChatId);
        if (chat) {
            chatHeader.innerHTML = `<h2>${chat.name}</h2>`;
        }
    } else {
        chatHeader.innerHTML = '<h2>Suhbatni tanlang</h2>';
    }
}

// Delete chat
async function deleteChat(chatId, event) {
    event.stopPropagation();
    
    if (!confirm('Suhbatni o\'chirmoqchisiz?')) return;

    try {
        const response = await fetch(`${API_URL}/conversations/${chatId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete chat');

        chats = chats.filter(chat => chat.userId !== chatId);
        if (selectedChatId === chatId) {
            selectedChatId = chats.length > 0 ? chats[0].userId : null;
        }
        renderChatsList();
        updateChatHeader();
        if (selectedChatId) {
            clearMessages();
        }
        showNotification('Suhbat o\'chirildi ✅', 'success');
    } catch (error) {
        console.error('Error deleting chat:', error);
        showNotification('Suhbatni o\'chirishda xato', 'error');
    }
}

// Send message
async function sendMessage(event) {
    event.preventDefault();

    if (!selectedChatId) {
        showNotification('Avval suhbatni tanlang', 'warning');
        return;
    }

    const input = document.getElementById('messageInput');
    const message = input.value.trim();

    if (!message) return;

    // Display user message
    addMessage(message, 'user');
    input.value = '';
    disableInputs();

    // Show typing indicator
    showTypingIndicator();

    try {
        // Send to backend
        const response = await fetch(`${API_URL}/ai-response`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                userId: selectedChatId
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            removeTypingIndicator();
            addMessage(data.reply, 'ai');
        } else {
            removeTypingIndicator();
            addMessage('Xato: AI javob kela olmadi', 'ai');
        }
    } catch (error) {
        console.error('Error:', error);
        removeTypingIndicator();
        addMessage('Xato: Serverga ulanib bo\'lmadi', 'ai');
        showNotification('Xato: Serverga ulanib bo\'lmadi', 'error');
    }

    enableInputs();
}

// Add message to chat
function addMessage(text, type) {
    const container = document.getElementById('messagesContainer');
    
    // Remove welcome message if exists
    const welcome = container.querySelector('.welcome-message');
    if (welcome) welcome.remove();

    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}`;
    
    const now = new Date();
    const time = now.toLocaleTimeString('uz-UZ', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    messageEl.innerHTML = `
        <div>
            <div class="message-content">${escapeHtml(text)}</div>
            <div class="message-time">${time}</div>
        </div>
    `;

    container.appendChild(messageEl);
    container.scrollTop = container.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
    const container = document.getElementById('messagesContainer');
    const typing = document.createElement('div');
    typing.className = 'message ai';
    typing.id = 'typingIndicator';
    typing.innerHTML = `
        <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    container.appendChild(typing);
    container.scrollTop = container.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
    const typing = document.getElementById('typingIndicator');
    if (typing) typing.remove();
}

// Clear messages
function clearMessages() {
    document.getElementById('messagesContainer').innerHTML = `
        <div class="welcome-message">
            <h2>🤖 Webgram'ga xush kelibsiz!</h2>
            <p>Yangi chat yaratish uchun "Yangi chat" tugmasini bosing</p>
        </div>
    `;
}

// Enable inputs
function enableInputs() {
    document.getElementById('messageInput').disabled = false;
    document.getElementById('sendBtn').disabled = false;
}

// Disable inputs
function disableInputs() {
    document.getElementById('messageInput').disabled = true;
    document.getElementById('sendBtn').disabled = true;
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show notification
function showNotification(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
}