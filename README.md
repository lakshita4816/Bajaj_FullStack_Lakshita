# SRM Full Stack Engineering Challenge Solution

This project implements:
- REST API endpoint: `POST /bfhl`
- Frontend single-page app to submit node lists and render results
- Full challenge rule handling (invalid entries, duplicates, multi-parent, cycles, depth, summary)

## Tech Stack
- Node.js + Express
- Plain HTML/CSS/JavaScript frontend

## Project Structure
- `src/server.js`: Express server and routes
- `src/bfhlProcessor.js`: core processing logic
- `public/`: frontend app
- `tests/runTests.js`: validation tests for challenge rules
- `.env.example`: identity config template

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env` from `.env.example` and fill your real values.
3. Start the app:
   ```bash
   npm run dev
   ```
4. Open: `http://localhost:3000`

## API Usage
### Endpoint
`POST /bfhl`

### Example Body
```json
{
  "data": ["A->B", "A->C", "B->D"]
}
```

### Content-Type
Must be `application/json`

## Challenge Rule Compliance
- Valid format enforced as `X->Y` where each node is one uppercase letter.
- Self loops like `A->A` are invalid.
- Whitespace is trimmed before validation.
- Duplicate edges are recorded once in `duplicate_edges` and excluded from tree construction.
- Multi-parent conflict: first parent edge wins; later parent edges are silently ignored.
- Cyclic groups return:
  - `tree: {}`
  - `has_cycle: true`
  - no `depth`
- Non-cyclic groups return `depth`, and omit `has_cycle`.
- Root fallback for pure cycles: lexicographically smallest node.
- Summary computes `total_trees`, `total_cycles`, and `largest_tree_root` with tie-break rule.

## Run Tests
```bash
npm test
```

## Deploy Notes
You can deploy this to Render/Railway/Vercel.
- API URL: `https://<your-domain>/bfhl`
- Frontend URL: `https://<your-domain>/`

## What You Must Replace
Update these in `.env` before submission:
- `USER_FULLNAME` (lowercase preferred, no spaces)
- `DOB_DDMMYYYY`
- `COLLEGE_EMAIL`
- `COLLEGE_ROLL_NUMBER`

No external API keys are used in this project.
