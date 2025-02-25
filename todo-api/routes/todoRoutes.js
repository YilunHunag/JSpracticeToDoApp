const express = require("express"); // 載入 Express 框架，幫助建立 API。
const Todo = require("../models/Todo"); // 從 models/Todo.js 引入 待辦事項的 Schema & Model，讓我們能操作 MongoDB 裡的 todos 集合。
const router = express.Router(); // 建立一個「獨立的路由 (Router)」，用來定義 /api/todos 相關的 API。

// 取得所有待辦事項
// 取得所有待辦事項（支持分頁）
router.get("/todos", async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;  // 取得分頁參數，預設 page=1 和 limit=10
      
      // 準備篩選條件的物件
      const filter = {};

      // 篩選條件: 根據complete (True or Fale)
      if (complete !== undefined){
        filter.completed = complete === "true"; // 字串轉為boolean
      }
      // 篩選條件: 關鍵字搜尋
      if (search){
        filter.title = {$regex: search, $options: "i"}; // i = 不區分大小寫
      }
      // 查詢mongo db並進行分頁
      const todos = await Todo.find()
        .skip((page - 1) * limit)  // 跳過前面的資料
        .limit(parseInt(limit));  // 限制回傳資料的數量
  
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
  
// 更新待辦事項的完成狀態
router.patch("/todos/:id", async (req, res) => {
    try {
      const { id } = req.params;  // 從 URL 取得待辦事項的 ID
      const { completed } = req.body;  // 從 request body 取得 completed 屬性（true 或 false）
  
      // 查詢並更新待辦事項的 completed 屬性
      const todo = await Todo.findByIdAndUpdate(id, { completed }, { new: true });
  
      if (!todo) {
        return res.status(404).json({ error: "待辦事項未找到" });
      }
  
      res.json(todo);  // 回傳更新後的待辦事項
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

module.exports = router;
