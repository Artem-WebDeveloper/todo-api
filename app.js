require('dotenv').config();
const express = require('express');
const app = express();
const pool = require('./db');
const port = 4000;

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.listen(port, () => {
  console.log(`Todo Server is running on port ${port}`);
});

(async function () {
  console.log('DB connected');
  const res = await pool.query('SELECT * FROM todos');
  console.log(res.rows);
})();
