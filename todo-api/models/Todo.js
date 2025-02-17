const mongoose = require("mongoose");

// 建立 Todo 資料模型
const TodoSchema = new mongoose.Schema({
  title: { type: String, required: true }, // 待辦事項標題（必填）
  completed: { type: Boolean, default: false }, // 是否完成，預設為 false
});

module.exports = mongoose.model("Todo", TodoSchema);
