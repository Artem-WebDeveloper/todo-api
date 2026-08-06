const db = require('../db');
const isValideTaskText = require('../utils/isValidTaskText');

class TodosController {
  async getTodos(req, res) {
    try {
      const result = await db.query(`SELECT * FROM todos`);
      res.status(200).json({
        status: 'success',
        data: result.rows,
      });
    } catch (err) {
      res.status(404).json({
        status: 'fail',
        message: err,
      });
    }
  }
  async getTodo(req, res) {
    try {
      const { id } = req.params;

      if (!/^\d+$/.test(id)) {
        return res.status(400).json({
          status: 'fail',
          message: `Invalid id: ${id}`,
        });
      }

      const result = await db.query('SELECT * FROM todos WHERE id = $1', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          status: 'fail',
          message: `Todo with id ${id} not found`,
        });
      }

      res.status(200).json({
        status: 'success',
        data: result.rows[0],
      });
    } catch (err) {
      res.status(500).json({
        status: 'fail',
        message: 'Something went wrong',
      });
    }
  }
  async createTodo(req, res) {
    try {
      const { text } = req.body;
      const { isValide, message } = isValideTaskText(text);

      if (!isValide) {
        return res.status(400).json({
          status: 'fail',
          message,
        });
      }

      const result = await db.query('INSERT INTO todos (text) VALUES ($1) RETURNING *', [
        text.trim(),
      ]);

      res.status(201).json({
        status: 'success',
        data: result.rows[0],
      });
    } catch (err) {
      res.status(500).json({
        status: 'fail',
        message: 'Something went wrong',
      });
    }
  }
  async updateTodo(req, res) {
    try {
      const { id } = req.params;

      if (!/^\d+$/.test(id)) {
        return res.status(400).json({ status: 'fail', message: `Invalid id: ${id}` });
      }

      let { text, is_done } = req.body;
      if (text === undefined && is_done === undefined) {
        return res.status(400).json({ status: 'fail', message: 'Nothing to update!' });
      }

      if (text !== undefined) {
        const { isValid, message } = isValideTaskText(text);
        if (!isValid) {
          return res.status(400).json({ status: 'fail', message });
        }
        text = text.trim();
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

      res.status(200).json({
        status: 'success',
        data: result.rows[0],
      });
    } catch (err) {
      res.status(500).json({
        status: 'fail',
        message: 'Something went wrong',
      });
    }
  }

  async deleteTodo(req, res) {
    try {
      const { id } = req.params;

      const result = await db.query('DELETE FROM todos WHERE id = $1', [id]);
      if (result.rowCount === 0) {
        return res.status(404).json({
          status: 'fail',
          message: `Todo with id ${id} not found`,
        });
      }

      res.status(204).send();
    } catch {
      res.status(500).json({
        status: 'fail',
        message: 'Something went wrong',
      });
    }
  }
}

module.exports = new TodosController();
