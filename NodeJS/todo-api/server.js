const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const todoRoutes = require("./routes/todoRoutes");
require("dotenv").config();
console.log("MONGO_URI:", process.env.MONGO_URI); // 檢測DB是否有效

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User"); // 假設你有一個 User 模型
const router = express.Router();

const app = express();
const PORT = process.env.PORT || 5000;

// 中間件 (Middleware)
app.use(cors());
app.use(express.json()); // 解析 JSON 格式的請求
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');  // 設置回應的 Content-Type 為 JSON
    next();  // 呼叫 next()，繼續處理其他的中間件或路由處理器
});

app.use("/api", todoRoutes);

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

// 註冊用戶
router.post("/register", async (req, res) => {
    const { username, password } = req.body;
  
    // 密碼加密
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
  
    // 儲存用戶到資料庫
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
  
    res.status(201).send("用戶註冊成功");
  });
  
  // 登入用戶
  router.post("/login", async (req, res) => {
    const { username, password } = req.body;
  
    // 找到用戶
    const user = await User.findOne({ username });
    if (!user) return res.status(400).send("用戶不存在");
  
    // 密碼比對
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send("密碼錯誤");
  
    // 生成 JWT Token
    const token = jwt.sign({ id: user._id }, "your_jwt_secret", { expiresIn: "1h" });
  
    res.json({ token });
  });
  
  module.exports = router;