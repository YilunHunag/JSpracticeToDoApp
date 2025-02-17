const express = require("express");
const Todo = require("../models/Todo"); // 引入 Todo 模型
const router = express.Router();

// 取得所有待辦事項
router.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find(); // 查詢所有待辦事項
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 新增待辦事項
router.post("/todos", async (req, res) => {
  try {
    const { title } = req.body;
    const newTodo = new Todo({ title });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 更新待辦事項
router.put("/todos/:id", async (req, res) => {
    try {
      const { id } = req.params;  // 從 URL 取得待辦事項 ID
      const { title, completed } = req.body;  // 從 request body 取得更新的資料
  
      const todo = await Todo.findByIdAndUpdate(id, { title, completed }, { new: true });
  
      if (!todo) {
        return res.status(404).json({ error: "待辦事項未找到" });
      }
  
      res.json(todo);  // 回傳更新後的待辦事項
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
// 刪除待辦事項
router.delete("/todos/:id", async (req, res) => {
    try {
      const { id } = req.params;  // 從 URL 取得待辦事項 ID
  
      const todo = await Todo.findByIdAndDelete(id);  // 根據 ID 刪除待辦事項
  
      if (!todo) {
        return res.status(404).json({ error: "待辦事項未找到" });
      }
  
      res.json({ message: "待辦事項已刪除", todo });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
module.exports = router;
