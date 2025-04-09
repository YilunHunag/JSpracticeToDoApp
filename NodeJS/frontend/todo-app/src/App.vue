<template>
  <div id="app">
    <h1>待辦事項</h1>

    <!-- 顯示待辦事項清單 -->
    <ul>
      <li v-for="todo in todos" :key="todo._id">
        <template v-if="editingTodoId === todo._id">
          <input v-model="editedTitle" />
          <button @click="updateTodo(todo._id)">✔️</button>
          <button @click="cancelEdit">❌</button>
        </template>

        <template v-else>
          <span :style="{ textDecoration: todo.completed ? 'line-through' : 'none' }">
            {{ todo.title }} - {{ todo.completed ? '完成' : '未完成' }}
          </span>
          <button @click="toggleComplete(todo)">切換狀態</button>
          <button @click="editTodo(todo)">✏️</button>
          <button @click="deleteTodo(todo._id)">刪除</button>
        </template>
      </li>
    </ul>

    <!-- 新增待辦事項的輸入框與按鈕 -->
    <input v-model="newTodoTitle" placeholder="輸入新的待辦事項">
    <button @click="addTodo">新增</button>
  </div>
</template>

<script>
import axios from "axios";  // 引入 Axios 來處理 HTTP 請求

export default {
  data() {
    return {
      todos: [],  // 存放從後端取得的待辦事項列表
      newTodoTitle: "",  // 新增待辦事項的標題
      editingTodoId: null,  // 目前正在編輯的待辦事項 ID
      editedTitle: "",  // 編輯中的待辦事項標題
    };
  },

  methods: {
    async fetchTodos() {
      try {
        const response = await axios.get("http://localhost:5000/api/todos");
        this.todos = response.data;  // 更新 Vue 的 todos 陣列
      } catch (error) {
        console.error("獲取待辦事項失敗:", error);
      }
    },

    async addTodo() {
      if (!this.newTodoTitle) return;
      try {
        const response = await axios.post("http://localhost:5000/api/todos", {
          title: this.newTodoTitle,
          completed: false,
        });
        this.todos.push(response.data);  // 更新 Vue 的 todos 陣列，將新項目加入
        this.newTodoTitle = "";  // 清空輸入框
      } catch (error) {
        console.error("新增待辦事項失敗:", error);
      }
    },

    async deleteTodo(id) {
      try {
        await axios.delete(`http://localhost:5000/api/todos/${id}`);
        this.todos = this.todos.filter(todo => todo._id !== id);
      } catch (error) {
        console.error("刪除待辦事項失敗:", error);
      }
    },

    async toggleComplete(todo) {
      try {
        const updatedTodo = { ...todo, completed: !todo.completed };
        const response = await axios.put(`http://localhost:5000/api/todos/${todo._id}`, updatedTodo);
        this.todos = this.todos.map(t => (t._id === todo._id ? response.data : t));
      } catch (error) {
        console.error("切換狀態失敗:", error);
      }
    },

    editTodo(todo) {
      this.editingTodoId = todo._id;
      this.editedTitle = todo.title;
    },

    async updateTodo(id) {
      try {
        const response = await axios.put(`http://localhost:5000/api/todos/${id}`, {
          title: this.editedTitle,
        });
        this.todos = this.todos.map(todo => (todo._id === id ? response.data : todo));
        this.editingTodoId = null;
        this.editedTitle = "";
      } catch (error) {
        console.error("更新待辦事項失敗:", error);
      }
    },

    cancelEdit() {
      this.editingTodoId = null;
      this.editedTitle = "";
    },

    // 登入
    async login() {
      const response = await axios.post("http://localhost:5000/api/login", {
        username: this.username,
        password: this.password,
      });
      localStorage.setItem("token", response.data.token);
    },

    // JWT token 請求
    async fetchData() {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/protected", {
        headers: {
          "x-auth-token": token,
        },
      });
      console.log(response.data);
    },
  },

  // 生命週期：當組件載入時，獲取待辦事項資料
  mounted() {
    this.fetchTodos();
  },
};
</script>
