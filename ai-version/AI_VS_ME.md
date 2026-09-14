# Stage 7 — AI vs Me

## The prompt

See [`PROMPT.md`](./PROMPT.md) in this folder — written from memory, without copying
from the assignment brief.

## Did it start on the first try?

Yes. `npm install && node server.js` ran clean, no errors.

## Stage 4 checkpoint results (fired at the AI version)

| Test | Expected | Got | Pass? |
|---|---|---|---|
| GET /tasks/1 | 200 | 200 | ✅ |
| GET /tasks/99 | 404 | 404 | ✅ |
| POST valid task | 201 | 201 | ✅ |
| POST empty body | 400 | 400 | ✅ |
| PUT /tasks/1 with only `{"done":true}` | 200 (partial update) | 400 `"title and done are both required"` | ❌ |
| DELETE /tasks/2 | 204 | 204 | ✅ |
| DELETE /tasks/99 | 404 | 404 | ✅ |

6 out of 7 passed. The one failure is real and worth understanding, not just a bug —
see below.

## What did the AI do better?

- The whole thing in one file, exactly as asked, and I understand every line of it —
  it's a smaller, denser version of the same patterns I already used by hand.
- It didn't over-build: no extra endpoints, no libraries I didn't ask for.

## What did it get wrong or quietly decide for me?

1. **PUT is a full replace, not a partial update.** My prompt said "update a task" but
   never specified whether the client has to send the whole object or just the field
   they're changing. The AI silently chose "require both `title` and `done` every time."
   My hand-built version supports partial updates (`{"done":true}` alone works), which is
   what the assignment brief's Stage 4 checkpoint actually exercises. This is exactly the
   kind of thing that looks fine until you fire your own checkpoint at it and it fails.
2. **Loose equality (`t.id == req.params.id`) instead of `Number(req.params.id)`.**
   It works today because JS coerces `'1' == 1` to true, but it's a silent type-coercion
   footgun I wouldn't want in a codebase I own — an easy source of a future bug if the
   comparison logic ever changes.
3. **No `GET /` or `GET /health` endpoints.** I never asked for them in this prompt (I
   forgot to — see below), so their absence isn't the AI "getting it wrong," it's my
   prompt being incomplete.

## What did my prompt forget to specify?

- Whether `PUT` should support **partial** updates or require the full object — this was
  the one gap that actually broke a test.
- The root `GET /` and `GET /health` endpoints — I didn't mention them at all, and the
  AI reasonably didn't add anything I hadn't asked for.
- Whether task IDs should be compared as numbers or left as loose-equality strings — I
  assumed "obviously numbers" but never said so.

## One rematch — what I changed

Added one sentence to the prompt: *"PUT should support partial updates — the client may
send just `title`, just `done`, or both, and only the fields present should change."*
Re-ran it: the regenerated version switched to checking `if (title !== undefined)` /
`if (done !== undefined)` separately instead of requiring both, and Test 5 passed on
the second attempt.

## The lesson

An AI's output is exactly as good as the specification — the PUT gap didn't come from
the AI being careless, it came from my prompt leaving a real design decision unstated.
I could only tell it was wrong because I'd already built the correct behavior by hand
and had a checkpoint test to fire at it. Without Stages 0–6, I'd have shipped the
full-replace version and never noticed the difference until a real client hit it.
