// Matrix Integration Test Harness - Express TODO API
import express from "express";
import cors from "cors";
import { TodoService } from "./service.js";
import { TodoRouter } from "./router.js";

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

const service = new TodoService();
const todoRouter = new TodoRouter(service);
app.use(todoRouter.router);

app.listen(PORT, () => {
  console.log(`Matrix Test Harness running on http://localhost:${PORT}`);
});
