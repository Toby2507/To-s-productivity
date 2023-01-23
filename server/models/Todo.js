const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema({
    item: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Todo', todoSchema);