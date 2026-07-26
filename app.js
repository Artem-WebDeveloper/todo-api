const express = require('express');
const app = express();

const port = 4000;

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.listen(port, () => {
  console.log(`Todo Server is running on port ${port}`);
});
