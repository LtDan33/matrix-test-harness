import express from "express";
import { getAll, add, remove } from "./store.js";

const app = express();
app.use(express.json());

const PORT = 4444;

app.get("/", (_req, res) => {
  res.send(`
    <html><body style="font-family:monospace;background:#1a1c2e;color:#5ddf8b;padding:2rem">
      <h1>Matrix Test Harness</h1>
      <p>Express + TypeScript TODO API on port ${PORT}</p>
      <p>Endpoints: GET /api/health, GET /api/todos, POST /api/todos, DELETE /api/todos/:id</p>
    </body></html>
  `);
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, todos: getAll().length });
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
