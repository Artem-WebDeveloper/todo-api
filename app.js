require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const todoRouter = require('./routes/todos.route');

const PORT = process.env.PORT || 4000;

app.use(morgan('dev'));
app.use(express.json());
app.use('/api/v1', todoRouter);

app.use(err => {});

app.listen(PORT, () => {
  console.log(`Todo Server is running on port ${PORT}`);
});
