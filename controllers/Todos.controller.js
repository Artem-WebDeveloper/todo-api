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
  async createTodo() {}
  async updateTodo() {}
  async deleteTodo() {}
}

module.exports = new TodosController();
