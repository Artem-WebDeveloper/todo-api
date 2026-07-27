const express = require('express');
const router = express.Router();
const TodosController = require('../controllers/Todos.controller');

router.get('/todos', TodosController.getTodos);
router.get('/todos/:id', TodosController.getTodo);
router.post('/todos', TodosController.createTodo);
router.patch('/todos/:id', TodosController.updateTodo);
router.delete('/todos/:id', TodosController.deleteTodo);

module.exports = router;
