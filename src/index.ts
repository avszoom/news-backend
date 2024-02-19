import express from 'express';
import { deleteRecords, fetchNews} from './orm/orm';
import {removedOldArticles, updateDatabase} from './cron/cron';
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
  const articles = await fetchNews(1000);
  res.send(articles);
});

//insert into database
app.get('/cron', async (req,res) => {
  const systemKey = req.headers['system-id'];
  if(!systemKey || systemKey != 'zwe898232'){
    res.status(401).send('You are not authorized to run this job');
  }
  // fetch new record and insert
  await updateDatabase();
  //remove old records
  await removedOldArticles();
  res.send("succeeded.");
}
);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

export default app;