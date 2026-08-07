const db = require('../db');
const isValidTaskText = require('../utils/isValidTaskText');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

class TodosController {
  getTodos = catchAsync(async (req, res, next) => {
    const result = await db.query(`SELECT * FROM todos`);

    res.status(200).json({
      status: 'success',
      data: result.rows,
    });
  });

  getTodo = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) return next(new AppError(`Invalid id: ${id}`, 400));

    const result = await db.query('SELECT * FROM todos WHERE id = $1', [id]);

    if (result.rows.length === 0) return next(new AppError(`Todo with id ${id} not found`, 404));

    res.status(200).json({
      status: 'success',
      data: result.rows[0],
    });
  });

  createTodo = catchAsync(async (req, res, next) => {
    const { text } = req.body;
    const { isValid, message } = isValidTaskText(text);

    if (!isValid) return next(new AppError(message, 400));

    const result = await db.query('INSERT INTO todos (text) VALUES ($1) RETURNING *', [
      text.trim(),
    ]);

    res.status(201).json({
      status: 'success',
      data: result.rows[0],
    });
  });

  updateTodo = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    if (!/^\d+$/.test(id)) return next(new AppError(`Invalid id: ${id}`, 400));

    let { text, is_done } = req.body;
    if (text === undefined && is_done === undefined) {
      return next(new AppError('Nothing to update!', 400));
    }

    if (text !== undefined) {
      const { isValid, message } = isValidTaskText(text);
      if (!isValid) return next(new AppError(message, 400));
    }

    text = text.trim();

    let queryParams;
    if (is_done === undefined) {
      queryParams = {
        str: 'UPDATE todos SET text = $1 , updated_at = NOW() WHERE id = $2 RETURNING *',
        vars: [text, id],
      };
    } else if (text === undefined) {
      queryParams = {
        str: 'UPDATE todos SET is_done = $1 , updated_at = NOW() WHERE id = $2 RETURNING *',
        vars: [is_done, id],
      };
    } else {
      queryParams = {
        str: 'UPDATE todos SET text = $1 , is_done = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
        vars: [text, is_done, id],
      };
    }

    const result = await db.query(queryParams.str, queryParams.vars);

    if (result.rows.length === 0) {
      return next(new AppError(`Todo with id ${id} not found`, 404));
    }

    res.status(200).json({
      status: 'success',
      data: result.rows[0],
    });
  });

  deleteTodo = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    if (!/^\d+$/.test(id)) return next(new AppError(`Invalid id: ${id}`, 400));

    const result = await db.query('DELETE FROM todos WHERE id = $1', [id]);
    if (result.rowCount === 0) return next(new AppError(`Todo with id ${id} not found`, 404));

    res.status(204).send();
  });
}

module.exports = new TodosController();
