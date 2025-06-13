const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
const OpenAI = require('openai');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 9000;

app.use(cors());
app.use(express.json());

app.get('/api/stocks/:symbol', async (req, res) => {
    const { symbol } = req.params;
    const apiKey = process.env.FINNHUB_API_KEY;
  
    try {
      const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch stock data' });
    }
  });

  app.get('/api/tips', (req, res) => {
    res.json([
      "Automate your savings to avoid temptation.",
      "Cancel unused subscriptions.",
      "Use cash-back or rewards programs.",
      "Buy in bulk to save over time.",
      "Have a 24-hour rule before big purchases.",
      "Round up your purchases and save the change.",
      "Cut grocery bills by shopping with a list (and sticking to it).",
      "Always compare subscriptions you might find a cheaper or free alternative.",
      "Don't chase trends — chase financial peace.",
      "Know your financial goals and your financial triggers.",
      "Before you upgrade your lifestyle, upgrade your savings and invest smartly.",
      "Being money smart is not about being rich but its about being intentional.",
      "Check your bank account daily like you check social media — it builds awareness."
    ]);
  });
  
  const OpenAI = require("openai");

    const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    });
  
  app.post('/api/ai', express.json(), async (req, res) => {
    const { message } = req.body;
  
    try {
      const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
      });
      res.json({ reply: completion.data.choices[0].message.content });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get AI response' });
    }
  });

  app.get('/api/convert', async (req, res) => {
    const { from, to, amount } = req.query;
    const apiKey = process.env.EXCHANGE_API_KEY;
  
    try {
      const response = await axios.get(`https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}/${amount}`);
      res.json(response.data);
    } catch (err) {
      res.status(500).json({ error: 'Failed to convert currency' });
    }
  });

  app.get('/api/compare', async (req, res) => {
    const { query } = req.query;
    const apiKey = process.env.SERPAPI_KEY;
    try {
      const response = await axios.get('https://serpapi.com/search', {
        params: {
          engine: 'google_product',
          q: query,
          api_key: apiKey,
          offers: true,
        }
      });
      const offers = response.data.shopping_results || [];

      offers.sort((a, b) => a.price - b.price);
      res.json({ offers });
    } catch (error) {
      res.status(500).json({ error: 'Product comparison failed' });
    }
  });  
  


app.listen(PORT, () =>{
    console.log(`Backend is running on http://localhost:${PORT}`);
});