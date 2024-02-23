import express from 'express';
import {fetchNews} from './orm/orm';
import {removedOldArticles, updateDatabase} from './cron/cron';
import { GoogleGenerativeAI } from "@google/generative-ai";

// es6 module


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
  const key = process.env.GOOGLE_API_KEY ?? "";
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  const title = "Jayo Archer, Motocross star and X Games medalist, dies at 27 - ESPN"
  const desc = `Freestyle motocross athlete Jayden "Jayo" Archer, an X Games medalist and the first rider 
  to perform a triple backflip in competition, died Wednesday morning in Melbourne, Australia. He was 27.`
  const long_desc = `Freestyle motocross athlete Jayden "Jayo" Archer, an X Games medalist and the first rider to perform a triple backflip in competition, 
  died while practicing the trick Wednesday morning in his hometow… [+2809 chars]`;
  const prompt = `
    You are an editor. Consider an article with title: ${title} ,short description: 
    ${desc} and long description as ${long_desc}. Generate a fresh title and description for news which is accurate but same 
    time very catchy to read. Return response as json as below - {title: '', desc: '', country: '', category: ''}
  `
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  res.send(text)
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

export default app;

