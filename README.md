# 🤖 Webgram - Telegram-like AI Chat Application

Webgram - bu Telegram-ga o'xshash chat dasturi bo'lib, Google Gemini AI bilan suhbat qilish imkoniyatini beradi. Hech qachon yolg'iz bo'lmang! 🚀

## ✨ Xususiyatlari

- 💬 Multiple AI assistants bilan suhbat
- 🤖 Google Gemini AI API integratsiyasi
- 🎨 Telegram-ga o'xshash interfeys
- 📱 Responsive design (mobil va desktop)
- ⚡ Real-time AI responses
- 🗑️ Chat tarix o'chirish
- 🔄 Suhbat tarixini saqlash

## 🛠️ Texnologiyalar

### Backend
- Node.js
- Express.js
- Google Generative AI SDK
- CORS enabled

### Frontend
- React 18
- CSS3
- Responsive Design

## 📦 O'rnatish

### 1. Repository clonlash

```bash
git clone https://github.com/Sanjarbek191/Webgram.git
cd Webgram
```

### 2. Backend o'rnatish

```bash
# Dependencies o'rnatish
npm install

# Environment file yaratish
cp .env.example .env

# .env faylida GOOGLE_API_KEY qo'shish
```

### 3. Google Gemini API Key olish

1. [Google AI Studio](https://makersuite.google.com/app/apikey) saytiga boring
2. "Create API Key" tugmasini bosing
3. API key-ni `.env` faylida qo'shing:
   ```
   GOOGLE_API_KEY=your_key_here
   ```

### 4. Frontend o'rnatish

```bash
# React loyihasi yaratish
npx create-react-app client

# Frontend papkasiga kirish
cd client
npm install
```

## 🚀 Ishga tushirish

### 1. Backend ishga tushirish (Terminal 1)

```bash
npm run dev
# Server http://localhost:5000 da ishga tushadi
```

### 2. Frontend ishga tushirish (Terminal 2)

```bash
cd client
npm start
# Sayt http://localhost:3000 da ochiladi
```

## 📋 API Endpoints

### 1. AI Response olish
**POST** `/api/ai-response`

**Request:**
```json
{
  "message": "Salom, bu kim?",
  "userId": "user_123"
}
```

**Response:**
```json
{
  "success": true,
  "reply": "Salom! Men AI assistant. Sizga qanday yordam bera olaman?",
  "userId": "user_123"
}
```

### 2. Barcha suhbatlarni olish
**GET** `/api/conversations`

**Response:**
```json
[
  {
    "userId": "user_123",
    "name": "AI Assistant user_"
  },
  {
    "userId": "user_456",
    "name": "AI Assistant user_"
  }
]
```

### 3. Chat suhbatni o'chirish
**DELETE** `/api/conversations/:userId`

**Response:**
```json
{
  "success": true,
  "message": "Conversation cleared"
}
```

## 📁 Loyiha tuzilishi

```
Webgram/
├── server.js              # Backend server (Express)
├── package.json           # Backend dependencies
├── .env.example           # Environment variables template
├── .gitignore
├── README.md
└── client/                # React frontend
    ├── src/
    │   ├── components/
    │   │   ├── ChatList.jsx      # Chat ro'yxati
    │   │   └── ChatWindow.jsx    # Chat oyna
    │   ├── App.jsx               # Asosiy component
    │   ├── App.css               # Styles
    │   ├── index.js              # Entry point
    │   └── index.css
    ├── public/
    ├── package.json
    └── .gitignore
```

## 🎨 Frontend Komponentlari

Client papkasiga quyidagi fayllarni qo'shish kerak:

### `client/src/components/ChatList.jsx`
- Chat ro'yxatini ko'rsatadi
- Yangi chat yaratish
- Chat o'chirish

### `client/src/components/ChatWindow.jsx`
- Xabarlarni ko'rsatadi
- Input message shaklini o'z ichiga oladi
- Real-time AI javoblarni qabul qiladi

### `client/src/App.jsx`
- Asosiy applicationlogik
- State management
- API calls

## 🔌 Frontend Setup

`client/src/App.jsx` faylida:

```jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';

function App() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [userId] = useState(`user_${Math.random().toString(36).substr(2, 9)}`);

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

  return (
    <div className="webgram-container">
      <ChatList 
        chats={chats} 
        selectedChat={selectedChat}
        onSelectChat={setSelectedChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
      />
      {selectedChat && (
        <ChatWindow 
          chat={selectedChat}
          userId={userId}
        />
      )}
    </div>
  );
}

export default App;
```

## 💻 Ishchi buyruqlar

```bash
# Backend ishga tushirish
npm run dev

# Production mode
npm start

# Frontend ishga tushirish
cd client && npm start

# Hammasi o'rnatish
npm run install-all
```

## 🐛 Muammolarni hal qilish

### CORS xatosi
- Backend va Frontend bir xil portda bo'lmasligi kerak
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

### API Key xatosi
- `.env` faylida GOOGLE_API_KEY o'rnatilganligini tekshiring
- API key to'g'ri bo'lganligini tekshiring

### Connection xatosi
- Backend server ishga tushanligini tekshiring
- Port 5000 bo'sh bo'lganligini tekshiring

## 📝 Environment Variables

```env
GOOGLE_API_KEY=your_api_key_here
PORT=5000
```

## 🤝 Contributorship

Xatolik topsan yoki taklif bermoqchi bo'lsang:
1. Issues ochish
2. Pull requests yuborish

## 📄 Litsenziya

MIT License

## 👨‍💻 Muallif

Sanjarbek191

## 🚀 Deployed Version

Yaqinda Deploy qilinadi...

---

**Webgram bilan hech qachon yolg'iz bo'lmang!** 🤖💬

Savol yoki muammo bo'lsa, GitHub Issues orqali murojaat qiling.