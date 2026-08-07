require('dotenv').config();

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const express = require('express');
const app = express();
const morgan = require('morgan');
const todoRouter = require('./routes/todos.route');
const globalErrorHandler = require('./controllers/error.controller');

const PORT = process.env.PORT || 4000;

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/v1', todoRouter);

app.all('/*splat', (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.status = 'fail';
  err.statusCode = 404;
  next(err);
});

app.use(globalErrorHandler);

const server = app.listen(PORT, () => {
  console.log(`Todo Server is running on port ${PORT}`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLER REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
