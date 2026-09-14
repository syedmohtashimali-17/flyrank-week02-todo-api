const express = require('express');
const swaggerUi = require('swagger-ui-express');
const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory task store
let tasks = [
  { id: 1, title: 'Buy milk', done: false },
  { id: 2, title: 'Read a book', done: false },
  { id: 3, title: 'Walk the dog', done: true },
];
let nextId = 4;

const openapiSpec = {
  openapi: '3.0.0',
  info: { title: 'Task API', version: '1.0.0' },
  paths: {
    '/tasks': {
      get: { summary: 'Get all tasks', responses: { 200: { description: 'OK' } } },
      post: { summary: 'Create a task', responses: { 201: { description: 'Created' } } },
    },
    '/tasks/{id}': {
      get: { summary: 'Get a task', responses: { 200: { description: 'OK' }, 404: { description: 'Not found' } } },
      put: { summary: 'Update a task', responses: { 200: { description: 'OK' } } },
      delete: { summary: 'Delete a task', responses: { 204: { description: 'No Content' } } },
    },
  },
};
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.get('/tasks/:id', (req, res) => {
  const task = tasks.find((t) => t.id == req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

app.post('/tasks', (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const task = { id: nextId++, title, done: false };
  tasks.push(task);
  res.status(201).json(task);
});

// Full replace: expects BOTH title and done every time, not a partial update
app.put('/tasks/:id', (req, res) => {
  const task = tasks.find((t) => t.id == req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  const { title, done } = req.body;
  if (!title || done === undefined) {
    return res.status(400).json({ error: 'title and done are both required' });
  }
  task.title = title;
  task.done = done;
  res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const index = tasks.findIndex((t) => t.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Task not found' });
  tasks.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, () => console.log(`AI-version server running on http://localhost:${PORT}`));
