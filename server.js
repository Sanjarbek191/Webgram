const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Store active conversations
const conversations = new Map();

// Initialize chat model
async function initializeChat(userId) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const chat = model.startChat({
    history: [],
    generationConfig: {
      maxOutputTokens: 500,
    },
  });
  conversations.set(userId, chat);
  return chat;
}

// Get AI Response
app.post('/api/ai-response', async (req, res) => {
  try {
    const { message, userId } = req.body;
    
    if (!userId || !message) {
      return res.status(400).json({ error: 'Missing userId or message' });
    }

    let chat = conversations.get(userId);
    if (!chat) {
      chat = await initializeChat(userId);
    }

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      reply: text,
      userId: userId
    });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all conversations
app.get('/api/conversations', (req, res) => {
  const conversationList = Array.from(conversations.keys()).map(userId => ({
    userId,
    name: `AI Assistant ${userId.slice(0, 5)}`
  }));
  res.json(conversationList);
});

// Clear conversation
app.delete('/api/conversations/:userId', (req, res) => {
  const { userId } = req.params;
  conversations.delete(userId);
  res.json({ success: true, message: 'Conversation cleared' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Webgram server running on port ${PORT}`);
});