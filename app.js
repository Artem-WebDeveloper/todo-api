require('dotenv').config();
const express = require('express');
const app = express();

const todoRouter = require('./routes/todos.route');

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use('/api/v1', todoRouter);

app.listen(PORT, () => {
  console.log(`Todo Server is running on port ${PORT}`);
});
