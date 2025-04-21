import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions',{
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization":`Bearer ${process.env.API_KEY}`
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: req.body.messages
      })
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

app.listen(3000, () => console.log("Server started on http://localhost:3000"));