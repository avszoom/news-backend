import express from 'express';
import NewsAPI from './apis/fetchNews';
//initialize
require('dotenv').config();
const app = express();
const cors = require('cors');

app.use(cors());

const port = 3000;
app.get('/', (req, res) => {
  res.send('healthy');
});

//TODO - call an api, and fetch top 100 news
app.get('/news',async (req,res) => {
  const news = new NewsAPI();
  const articles = await news.getTodaysNews();
  res.send(articles);
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

export default app;