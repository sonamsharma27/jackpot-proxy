const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors()); // Allow all origins

// Base URLs
const SEARCH_BASE_URL = "https://jpapi-staging.jackpot.bet/casino/games/search";
const GAMES_BASE_URL = "https://jpapi-staging.jackpot.bet/casino/games";

// Search API proxy
app.get("/search", async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: "Missing query" });

  try {
    const response = await axios.get(SEARCH_BASE_URL, {
      params: { query },
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
      timeout: 15000,
    });
    res.json({ data: response.data });
  } catch (err) {
    console.error("Search Proxy Error:", err.message);
    res.status(502).json({ error: "Search fetch failed" });
  }
});

// Games list API proxy
app.get("/games", async (req, res) => {
  const { limit, offset, category } = req.query;

  try {
    const response = await axios.get(GAMES_BASE_URL, {
      params: { limit, offset, category },
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
      timeout: 15000,
    });
    res.json({ data: response.data });
  } catch (err) {
    console.error("Games Proxy Error:", err.message);
    res.status(502).json({ error: "Games fetch failed" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
