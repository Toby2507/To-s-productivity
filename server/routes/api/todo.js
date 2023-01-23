const express = require('express');
const router = express.Router();
const todoController = require('../../controllers/todoControllers');

router.route('/')
    .get(todoController.getTodos)
    .post(todoController.addTodo)
    .delete(todoController.deleteManyTodos);

router.route('/:todoId')
    .patch(todoController.updateTodo)
    .delete(todoController.deleteTodo)

module.exports = router;