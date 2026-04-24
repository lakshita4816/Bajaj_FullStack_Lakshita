<div align="center">

# BFHL Hierarchy Engine

### SRM Full Stack Engineering Challenge Submission

[![Node.js](https://img.shields.io/badge/Node.js-22+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2023-F7DF1E?style=for-the-badge&logo=javascript&logoColor=000)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Status](https://img.shields.io/badge/Status-Ready_for_Submission-0A8F7A?style=for-the-badge)](#)

*A full-stack web app that analyzes node hierarchies, detects cycles, and returns structured insights through* `/bfhl`.

[Overview](#-overview) • [Features](#-features) • [Installation](#-installation) • [API](#-api-endpoint) • [Testing](#-testing) • [Submission](#-submission-checklist)

</div>

---

## Overview

This project solves the **SRM Full Stack Engineering Challenge** using a Node.js + Express backend and a single-page frontend.

It accepts graph-style edge input (example: `A->B`) and returns:

- Hierarchies for all independent groups
- Cycle detection results
- Invalid input entries
- Duplicate edge entries
- Summary metrics (`total_trees`, `total_cycles`, `largest_tree_root`)

---

## Features

- `POST /bfhl` REST API with JSON validation
- Full rule-compliant processing as defined in the challenge paper
- Duplicate edge handling (recorded once, first edge used)
- Multi-parent handling (first parent wins)
- Cycle detection with required output structure
- Depth calculation for non-cyclic trees
- Modern frontend UI with sample loader and readable response rendering
- CORS enabled for cross-origin evaluator calls

---

## Project Structure

```text
FULL STACK/
├── public/
│   ├── app.js               # Frontend logic
│   ├── index.html           # Single-page UI
│   └── styles.css           # UI styling
├── src/
│   ├── bfhlProcessor.js     # Core hierarchy processing engine
│   └── server.js            # Express app and routes
├── tests/
│   └── runTests.js          # Rule validation tests
├── .env.example             # Environment template
├── package.json
└── README.md
```

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Runtime | Node.js |
| Backend | Express.js |
| Language | JavaScript |
| Frontend | HTML, CSS, Vanilla JS |
| Testing | Node assert |

---

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/lakshita4816/Bajaj_FullStack_Lakshita.git
cd Bajaj_FullStack_Lakshita
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create `.env` in project root:

```env
PORT=3000
USER_FULLNAME=LAKSHITA
DOB_DDMMYYYY=18052004
COLLEGE_EMAIL=ls2725@srmist.edu.in
COLLEGE_ROLL_NUMBER=RA2311004010354
```

### 4. Start App

```bash
npm run dev
```

Open: `http://localhost:3000`

---

## API Endpoint

### Route

`POST /bfhl`

### Content-Type

`application/json`

### Sample Request

```json
{
  "data": ["A->B", "A->C", "B->D"]
}
```

### Sample Response Shape

```json
{
  "user_id": "lakshita_18052004",
  "email_id": "ls2725@srmist.edu.in",
  "college_roll_number": "RA2311004010354",
  "hierarchies": [],
  "invalid_entries": [],
  "duplicate_edges": [],
  "summary": {
    "total_trees": 0,
    "total_cycles": 0,
    "largest_tree_root": ""
  }
}
```

---

## Challenge Rule Coverage

- Valid format enforced: `X->Y` where `X` and `Y` are uppercase single letters
- Invalid entries captured (including self-loop `A->A`, malformed input, empty values)
- Duplicate edges listed once in `duplicate_edges`
- Multi-parent conflict resolved by first-encountered parent
- Pure cycle root fallback uses lexicographically smallest node
- Cyclic group output includes `has_cycle: true` and `tree: {}` (no `depth`)
- Non-cyclic tree output includes `depth` and omits `has_cycle`
- `largest_tree_root` tie-break uses lexicographical order

---

## Frontend Usage

1. Open the app in browser
2. Keep API URL as `/bfhl` for local testing
3. Paste JSON array or use **Load Sample**
4. Click **Analyze Hierarchies**
5. Review structured output cards

---

## Testing

Run automated checks:

```bash
npm test
```

Expected output:

```text
All tests passed.
```

Quick API verification (PowerShell):

```powershell
$body = @{ data = @('A->B','A->C','B->D') } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/bfhl" -Method Post -ContentType "application/json" -Body $body | ConvertTo-Json -Depth 20
```

---

## Deployment Notes

Deploy on any platform (Render, Railway, Vercel, etc.).

- **Backend Base URL to submit**: `https://your-deployed-domain.com`
- Evaluator will call: `https://your-deployed-domain.com/bfhl`

Important: In submission form, **do not append `/bfhl`** in the base URL field.

---

## Submission Checklist

- Hosted API base URL
- Hosted frontend URL
- Public GitHub repository URL

---

## Author

Lakshita

- GitHub: [lakshita4816](https://github.com/lakshita4816)
- Repository: [Bajaj_FullStack_Lakshita](https://github.com/lakshita4816/Bajaj_FullStack_Lakshita)

---

<div align="center">

Built for the SRM Full Stack Challenge

</div>
