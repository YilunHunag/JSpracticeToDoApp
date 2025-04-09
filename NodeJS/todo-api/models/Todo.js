// 載入 mongoose 模組，並把它存到 mongoose 變數中
const mongoose = require("mongoose");
 

// 建立 Todo 資料模型
const TodoSchema = new mongoose.Schema({
  title: { 
    type: String, required: true 
    }, // 待辦事項標題

  completed: { 
    type: Boolean, default: false 
    }, // 是否完成，預設為 false
});
// 幫我在 MongoDB 裡建立 (或連接) 一個叫做 "todos" 的集合，並用 Todo 這個變數來代表它。
// 讓這個模型可以被其他檔案引用 (export 出去)，這樣 todoRoutes.js 或其他地方才能使用
module.exports = mongoose.model("Todo", TodoSchema);
