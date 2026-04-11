import { Router, Request, Response } from "express";
import { TodoService } from "./service.js";

const INDEX_HTML = `<!DOCTYPE html>
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
</body></html>`;

export class TodoRouter {
  public readonly router: Router;

  constructor(private readonly service: TodoService) {
    this.router = Router();
    this.registerRoutes();
  }

  private registerRoutes(): void {
    this.router.get("/", this.index);
    this.router.get("/api/echo", this.echo);
    this.router.get("/api/health", this.health);
    this.router.get("/api/stats", this.stats);
    this.router.get("/api/todos", this.list);
    this.router.get("/api/todos/:id", this.getOne);
    this.router.post("/api/todos", this.create);
    this.router.patch("/api/todos/:id", this.toggle);
    this.router.put("/api/todos/:id", this.update);
    this.router.delete("/api/todos/:id", this.remove);
  }

  private index = (_req: Request, res: Response): void => {
    res.send(INDEX_HTML);
  };

  private echo = (req: Request, res: Response): void => {
    const msg = req.query.msg;
    if (typeof msg !== "string") {
      res.status(400).json({ error: "msg query parameter is required" });
      return;
    }
    res.json({ echo: msg });
  };

  private health = (_req: Request, res: Response): void => {
    res.json({ ok: true, todos: this.service.getAll().length });
  };

  private stats = (_req: Request, res: Response): void => {
    res.json(this.service.stats());
  };

  private list = (_req: Request, res: Response): void => {
    res.json(this.service.getAll());
  };

  private parseId(raw: unknown): number | null {
    if (typeof raw !== "string") return null;
    const id = parseInt(raw, 10);
    return isNaN(id) ? null : id;
  }

  private getOne = (req: Request, res: Response): void => {
    const id = this.parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "invalid id" });
      return;
    }
    const todo = this.service.getById(id);
    if (!todo) {
      res.status(404).json({ error: "not found" });
      return;
    }
    res.json(todo);
  };

  private create = (req: Request, res: Response): void => {
    const { title } = req.body as { title?: unknown };
    if (typeof title !== "string" || title.trim().length === 0) {
      res.status(400).json({ error: "title is required and must be a non-empty string" });
      return;
    }
    if (title.trim().length > 200) {
      res.status(400).json({ error: "title must be under 200 characters" });
      return;
    }
    const todo = this.service.add(title.trim());
    res.status(201).json(todo);
  };

  private toggle = (req: Request, res: Response): void => {
    const id = this.parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "invalid id" });
      return;
    }
    const todo = this.service.toggle(id);
    if (!todo) {
      res.status(404).json({ error: "not found" });
      return;
    }
    res.json(todo);
  };

  private update = (req: Request, res: Response): void => {
    const id = this.parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "invalid id" });
      return;
    }
    const { title } = req.body as { title?: string };
    if (!title || typeof title !== "string") {
      res.status(400).json({ error: "title is required" });
      return;
    }
    const todo = this.service.updateTitle(id, title);
    if (!todo) {
      res.status(404).json({ error: "not found" });
      return;
    }
    res.json(todo);
  };

  private remove = (req: Request, res: Response): void => {
    const id = this.parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "invalid id" });
      return;
    }
    const removed = this.service.remove(id);
    if (!removed) {
      res.status(404).json({ error: "not found" });
      return;
    }
    res.json({ ok: true });
  };
}
