import express from 'express';
import {enrichArticle, fetchNews, fetchNewsWhichNeedToBeUpdated} from './orm/orm';
import {removedOldArticles, updateDatabase} from './cron/cron';
import fetchMetaData from './apis/fetchMetaData';

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
  console.log("received a new request");
  const systemKey = req.headers['news-id'];
  if(!systemKey || systemKey != 'nrs323217'){
    res.status(401).send('You are not authorized for this api');
    return;
  }
  const articles = await fetchNews(1000);
  res.send(articles);
});

//insert into database
app.get('/cron', async (req,res) => {
  const systemKey = req.headers['system-id'];
  if(!systemKey || systemKey != 'zwe898232'){
    res.status(401).send('You are not authorized to run this job');
    return;
  }
  // fetch new record and insert
  await updateDatabase();
  //remove old records
  await removedOldArticles();
  res.send("succeeded.");
}
);

app.get('/enrichArticles', async (req,res) => {
  // const systemKey = req.headers['system-id'];
  // if(!systemKey || systemKey != 'rcd91200'){
  //   res.status(401).send('You are not authorized to run this job');
  //   return;
  // }
  const news = await fetchNewsWhichNeedToBeUpdated(10); 
  for(const article of news){
    try {
      const articleMeta = await fetchMetaData(article.title,article.short_desc,article.content,article.id);
      await enrichArticle(articleMeta);
      console.log(`inserted ${article.id}`);
    } catch (e) {
      console.log(e);
    }
  }
  res.send("enrichment succeeded");
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

export default app;

