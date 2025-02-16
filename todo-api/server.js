const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// 中間件 (Middleware)
app.use(cors());
app.use(express.json()); // 解析 JSON 格式的請求

// 連接 MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB 連接成功"))
  .catch(err => console.error("❌ MongoDB 連接失敗:", err));

// 測試 API
app.get("/", (req, res) => {
    res.send("🎉 To-Do API 伺服器運行中！");
});

// 啟動伺服器
app.listen(PORT, () => {
    console.log(`🚀 伺服器正在運行於 http://localhost:${PORT}`);
});
