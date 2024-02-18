import express from 'express';
import NewsAPI from './apis/fetchNews';
import News from './model/News';
import { fetchNews, insertNews, lastInsertedRecordTime } from './orm/orm';
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
  const articles = await fetchNews(100);
  res.send(articles);
});

//insert into database
app.get('/updateDatabase', async (req,res) => {
  const lastRecordTime = await lastInsertedRecordTime();
  const news = new NewsAPI();
  const fromDate = lastRecordTime;
  const toDate = "";
  const articles = await news.getTodaysNews(fromDate,toDate);
  await insertNews(articles);
  res.send(`Records inserted ${articles.length}`)
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

export default app;