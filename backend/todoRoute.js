const express = require('express');
const Todo = require('./Todo');

const router = express.Router();

router.get('/getTodos', async (req, res) => {
    const userId = req.userId;
    try {
        const todos = await Todo.find({ userId });
        res.json({
            type: "success",
            todos
        })

    } catch (e) {
        res.json({
            type: "error",
            msg: e.message
        })
    }
})

router.post('/addTodo', async (req, res) => {
    const { title, description } = req.body;
    const userId = req.userId;
    if (!title || !description) {
        return res.status(400).json({
            type: "error",
            msg: "Title and description are required"
        });
    }
    try {
        await Todo.create({
            title,
            description,
            userId
        });
        res.json({
            type: "success",
            msg: "Todo added successfully"
        })
    } catch (e) {
        res.json({
            type: "error",
            msg: e.message
        })
    }
})

router.delete('/deleteTodo',async (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({
            type: "error",
            msg: "Title is required"
        });
    }
    try {
        const result = await Todo.deleteOne({ title });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                type: "error",  
                msg: "Todo not found"
            });
        }

        res.status(200).json({
            type: "success",
            msg: "Todo deleted successfully"
        });
    } catch (e) {
        res.status(500).json({
            type: "error",
            msg: "Internal server error",
            error: e.message
        });
    }
});

module.exports = router;