import express from 'express';

const app = express();
const cors = require('cors');
app.use(cors());

const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

export default app;