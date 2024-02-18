import express from 'express';
import { fetchNews} from './orm/orm';
import updateDatabase from './cron/cron';
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
  await updateDatabase();
  res.send("inserted");
}
);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

export default app;