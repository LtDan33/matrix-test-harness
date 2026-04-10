import express from "express";
import { getAll, add, toggle, remove } from "./store.js";
import { Stats } from "./types.js";

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(`${req.method} ${req.path} ${res.statusCode}`);
  });
  next();
});

const PORT = 4444;

app.get("/", (_req, res) => {
  res.send(`
    <html><body style="font-family:monospace;background:#1a1c2e;color:#5ddf8b;padding:2rem">
      <h1>Matrix Test Harness</h1>
      <p>Express + TypeScript TODO API on port ${PORT}</p>
      <p>Endpoints: GET /api/health, GET /api/stats, GET /api/todos, POST /api/todos, PATCH /api/todos/:id, DELETE /api/todos/:id</p>
    </body></html>
  `);
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

app.post("/api/todos", (req, res) => {
  const { title } = req.body as { title?: string };
  if (!title || typeof title !== "string") {
    res.status(400).json({ error: "title is required" });
    return;
  }
  const todo = add(title);
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
