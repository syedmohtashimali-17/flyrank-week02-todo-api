# Task API — CRUD API (FlyRank Backend Track, Week 2, A1)

A small in-memory API for managing a to-do list: create, read, update, and delete tasks.
Built by **Syed Mohtashim Ali** (BS Software Engineering, UBIT, University of Karachi — FlyRank Internship).

## What this is

A JavaScript/Express CRUD API with five endpoints, correct HTTP status codes, input validation,
and interactive Swagger UI documentation. Data is stored in memory only (no database yet —
that's next week) and resets whenever the server restarts.

## How to run it

```bash
git clone <this-repo-url>
cd todo-api
npm install
node server.js
```

Server starts on `http://localhost:3000`. Visit `http://localhost:3000/docs` for interactive
Swagger UI documentation.

## Endpoints

| CRUD | Method | Path          | Description                          |
|------|--------|---------------|---------------------------------------|
| —    | GET    | `/`           | API info                              |
| —    | GET    | `/health`     | Health check → `{ "status": "ok" }`   |
| Read | GET    | `/tasks`      | List all tasks (supports `?done=` and `?search=`) |
| —    | GET    | `/stats`      | Task counts: total, done, open        |
| Read | GET    | `/tasks/:id`  | Get one task (404 if not found)       |
| Create | POST | `/tasks`      | Create a task (400 if title missing)  |
| Update | PUT  | `/tasks/:id`  | Update title and/or done (404/400)    |
| Delete | DELETE | `/tasks/:id` | Delete a task → 204 (404 if not found)|

## Example: curl output

```
$ curl -i -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"Buy milk"}'

HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{"id":4,"title":"Buy milk","done":false}
```

## Swagger UI

`/docs` lists all five endpoints with a "Try it out" button for each — the full CRUD cycle
(create → list → update → delete) works there without touching curl.

*(Screenshot to be added here after running locally: open `http://localhost:3000/docs`,
capture the page, and drop the image in this README.)*

## The mortality experiment

Create a task, restart the server (`Ctrl+C` then `node server.js` again), then `GET /tasks`.

**What happens:** the task is gone — the list resets back to the 3 seed tasks.
**Why:** the data lives only in a JavaScript array in memory. Nothing is written to disk,
so when the process exits, that memory is freed and the array is rebuilt fresh from the
hardcoded seed data on the next start. This is exactly why Week 3 introduces a real database —
persistence is not automatic, it's a feature you have to build.

## AI vs Me (Stage 7 — bonus)

See [`ai-version/AI_VS_ME.md`](./ai-version/AI_VS_ME.md) for the full write-up: my prompt,
what the AI got right, what it got wrong, and what I hadn't specified.

## Stretch goals attempted

- Filtering: `GET /tasks?done=true` — returns only finished/unfinished tasks.
- Search: `GET /tasks?search=milk` — returns tasks whose title contains the word.
- Stats: `GET /stats` → `{ "total": 3, "done": 1, "open": 2 }`.
- The mortality experiment (above).

## Tech

Node.js, Express, swagger-ui-express. No database, no external services, $0 stack.
