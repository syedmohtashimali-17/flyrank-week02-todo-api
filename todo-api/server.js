const express = require('express');
const swaggerUi = require('swagger-ui-express');
const openapiSpec = require('./openapi.json');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

let tasks = [
  { id: 1, title: 'Buy milk', done: false },
  { id: 2, title: 'Finish FlyRank assignment', done: false },
  { id: 3, title: 'Walk the dog', done: true },
];
let nextId = 4;

app.get('/', (req, res) => {
  res.json({
    name: 'Task API',
    version: '1.0',
    endpoints: ['/tasks'],
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/tasks', (req, res) => {
  let result = tasks;
  if (req.query.done !== undefined) {
    const wantDone = req.query.done === 'true';
    result = result.filter((t) => t.done === wantDone);
  }
  if (req.query.search) {
    const term = req.query.search.toLowerCase();
    result = result.filter((t) => t.title.toLowerCase().includes(term));
  }
  res.json(result);
});

app.get('/stats', (req, res) => {
  res.json({
    total: tasks.length,
    done: tasks.filter((t) => t.done).length,
    open: tasks.filter((t) => !t.done).length,
  });
});

app.get('/tasks/:id', (req, res) => {
  const task = tasks.find((t) => t.id === Number(req.params.id));
  if (!task) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }
  res.json(task);
});

app.post('/tasks', (req, res) => {
  const { title } = req.body || {};
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'title is required and must be a non-empty string' });
  }
  const newTask = { id: nextId++, title: title.trim(), done: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/tasks/:id', (req, res) => {
  const task = tasks.find((t) => t.id === Number(req.params.id));
  if (!task) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }
  const { title, done } = req.body || {};
  if (title === undefined && done === undefined) {
    return res.status(400).json({ error: 'provide at least title or done to update' });
  }
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'title must be a non-empty string' });
    }
    task.title = title.trim();
  }
  if (done !== undefined) {
    if (typeof done !== 'boolean') {
      return res.status(400).json({ error: 'done must be true or false' });
    }
    task.done = done;
  }
  res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const index = tasks.findIndex((t) => t.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }
  tasks.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
