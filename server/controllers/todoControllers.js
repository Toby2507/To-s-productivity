const Todo = require('../models/Todo');
const errorHandler = require('../middlewares/errorHandler');

const getTodos = async (req, res) => {
    const userId = req.userId;
    const todos = await Todo.find({ userId }).exec();
    if (!todos) return res.status(204).json({ 'message': 'User has no active todos' });
    res.json(todos);
}

const addTodo = async (req, res) => {
    const userId = req.userId;
    const { todo } = req.body;
    if (!todo) return res.status(400).json({ 'message': 'Todo is required' });
    const newTodo = { ...todo, userId };
    try {
        await Todo.create(newTodo);
        res.status(200).json({ 'message': 'Todo added' });
    } catch (err) {
        errorHandler(err, req, res);
    }
}

const updateTodo = async (req, res) => {
    const { todoId: _id } = req.params;
    const todo = await Todo.findOne({ _id }).exec();
    if (!todo) return res.status(204).json({ 'message': `Todo ${_id} is not available` });
    todo.isCompleted = true;
    await todo.save();
    res.status(200).json({ 'message': 'Todo updated' });
}

const deleteTodo = async (req, res) => {
    const { todoId } = req.params;
    const todo = await Todo.findOne({ _id: todoId }).exec();
    if (!todo) return res.status(204).json({ 'message': `Todo ${todoId} is not available` });
    await Todo.deleteOne({ _id: todoId }).exec();
    res.status(200).json({ 'message': 'Todo deleted' });
}

const deleteManyTodos = async (req, res) => {
    const { todoIds } = req.body;
    if (!todoIds) return res.status(400).json({ 'message': 'Todo ids are required' });
    await Todo.deleteMany({ _id: { $in: todoIds } }).exec();
    res.status(200).json({ 'message': 'Todos deleted' });
}

module.exports = { getTodos, addTodo, updateTodo, deleteTodo, deleteManyTodos };