const db = require('../db');

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
      if (typeof text !== 'string' || !text.trim()) {
        return res.status(400).json({
          status: 'fail',
          message: 'Text is required and must be a non-empty string',
        });
      }

      const cleanText = text.trim();

      if (cleanText.length > 1000) {
        return res.status(400).json({
          status: 'fail',
          message: `Text of todo exceeds 1000 symbols!`,
        });
      }

      const result = await db.query('INSERT INTO todos (text) VALUES ($1) RETURNING *', [
        cleanText,
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
  async updateTodo() {}

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
