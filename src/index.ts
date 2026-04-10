import express from "express";
import cors from "cors";
import { getAll, getById, add, toggle, updateTitle, remove } from "./store.js";
import { Stats } from "./types.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(`${req.method} ${req.path} ${res.statusCode}`);
  });
  next();
});

const PORT = 4444;

app.get("/", (_req, res) => {
  res.send(`<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Matrix Test Harness</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: monospace; background: #1a1c2e; color: #c8d6e5; padding: 2rem; max-width: 600px; margin: 0 auto; }
  h1 { color: #5ddf8b; margin-bottom: 1rem; }
  .stats { background: #242842; padding: 1rem; border-radius: 6px; margin-bottom: 1.5rem; }
  .stats span { color: #5ddf8b; font-size: 1.2rem; font-weight: bold; }
  form { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; }
  input[type="text"] { flex: 1; padding: 0.5rem; background: #242842; border: 1px solid #5ddf8b; color: #c8d6e5; border-radius: 4px; font-family: monospace; }
  button { padding: 0.5rem 1rem; background: #5ddf8b; color: #1a1c2e; border: none; border-radius: 4px; cursor: pointer; font-family: monospace; font-weight: bold; }
  button:hover { background: #4bc477; }
  ul { list-style: none; }
  li { padding: 0.4rem 0; border-bottom: 1px solid #242842; }
  .done { text-decoration: line-through; opacity: 0.5; }
  #msg { color: #5ddf8b; margin-bottom: 0.5rem; min-height: 1.2rem; }
</style></head>
<body>
  <h1>Matrix Test Harness</h1>
  <div class="stats">
    Total: <span id="total">-</span> &nbsp; Completed: <span id="completed">-</span>
  </div>
  <form id="add-form">
    <input type="text" id="title" placeholder="New todo..." required />
    <button type="submit">Add</button>
  </form>
  <div id="msg"></div>
  <ul id="list"></ul>
  <script>
    async function refresh() {
      const stats = await fetch('/api/stats').then(r => r.json());
      document.getElementById('total').textContent = stats.totalTodos;
      document.getElementById('completed').textContent = stats.completedTodos;
      const todos = await fetch('/api/todos').then(r => r.json());
      const list = document.getElementById('list');
      list.replaceChildren();
      todos.forEach(t => {
        const li = document.createElement('li');
        if (t.completed) li.className = 'done';
        li.textContent = t.title;
        list.appendChild(li);
      });
    }
    document.getElementById('add-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = document.getElementById('title');
      const title = input.value.trim();
      if (!title) return;
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });
      if (res.ok) {
        input.value = '';
        document.getElementById('msg').textContent = 'Added!';
        setTimeout(() => document.getElementById('msg').textContent = '', 1500);
        refresh();
      }
    });
    refresh();
    setInterval(refresh, 5000);
  </script>
</body></html>`);
});

app.get("/api/echo", (req, res) => {
  const msg = req.query.msg;
  if (typeof msg !== "string") {
    res.status(400).json({ error: "msg query parameter is required" });
    return;
  }
  res.json({ echo: msg });
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, todos: getAll().length });
});

app.get("/api/stats", (_req, res) => {
  const todos = getAll();
  const stats: Stats = {
    totalTodos: todos.length,
    completedTodos: todos.filter((t) => t.completed).length,
  };
  res.json(stats);
});

app.get("/api/todos", (_req, res) => {
  res.json(getAll());
});

app.get("/api/todos/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "invalid id" });
    return;
  }
  const todo = getById(id);
  if (!todo) {
    res.status(404).json({ error: "not found" });
    return;
  }
  res.json(todo);
});

app.post("/api/todos", (req, res) => {
  const { title } = req.body as { title?: unknown };
  if (typeof title !== "string" || title.trim().length === 0) {
    res.status(400).json({ error: "title is required and must be a non-empty string" });
    return;
  }
  if (title.trim().length > 200) {
    res.status(400).json({ error: "title must be under 200 characters" });
    return;
  }
  const todo = add(title.trim());
  res.status(201).json(todo);
});

app.patch("/api/todos/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "invalid id" });
    return;
  }
  const todo = toggle(id);
  if (!todo) {
    res.status(404).json({ error: "not found" });
    return;
  }
  res.json(todo);
});

app.put("/api/todos/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "invalid id" });
    return;
  }
  const { title } = req.body as { title?: string };
  if (!title || typeof title !== "string") {
    res.status(400).json({ error: "title is required" });
    return;
  }
  const todo = updateTitle(id, title);
  if (!todo) {
    res.status(404).json({ error: "not found" });
    return;
  }
  res.json(todo);
});

app.delete("/api/todos/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "invalid id" });
    return;
  }
  const removed = remove(id);
  if (!removed) {
    res.status(404).json({ error: "not found" });
    return;
  }
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Matrix Test Harness running on http://localhost:${PORT}`);
});
