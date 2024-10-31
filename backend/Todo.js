const mongoose = require('mongoose');

const todoSchema= new mongoose.Schema({
    title:String,
    description:String,
    userId: mongoose.Types.ObjectId,
    isDone:Boolean
});

const Todo = mongoose.model('todo',todoSchema);

module.exports = Todo;