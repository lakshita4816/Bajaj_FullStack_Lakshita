const inputEl = document.getElementById("node-input");
const submitBtn = document.getElementById("submit-btn");
const sampleBtn = document.getElementById("sample-btn");
const responseRoot = document.getElementById("response-root");
const errorBox = document.getElementById("error-box");
const apiUrlEl = document.getElementById("api-url");

const sampleData = [
  "A->B",
  "A->C",
  "B->D",
  "C->E",
  "E->F",
  "X->Y",
  "Y->Z",
  "Z->X",
  "P->Q",
  "Q->R",
  "G->H",
  "G->H",
  "G->I",
  "hello",
  "1->2",
  "A->",
];

function asJsonOrCsv(text) {
  const trimmed = text.trim();

  if (!trimmed) {
    return [];
  }

  if (trimmed.startsWith("[")) {
    const parsed = JSON.parse(trimmed);
    if (!Array.isArray(parsed)) {
      throw new Error("Input JSON must be an array");
    }
    return parsed;
  }

  return trimmed
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function createBlock(title, value) {
  const card = document.createElement("div");
  card.className = "card";

  const h = document.createElement("h3");
  h.textContent = title;

  const pre = document.createElement("pre");
  pre.textContent = JSON.stringify(value, null, 2);

  card.appendChild(h);
  card.appendChild(pre);

  return card;
}

function renderResponse(payload) {
  responseRoot.innerHTML = "";

  const identityCard = document.createElement("div");
  identityCard.className = "card";
  identityCard.innerHTML = `
    <h3>Identity</h3>
    <div class="kv">
      <div><strong>user_id</strong><br>${payload.user_id}</div>
      <div><strong>email_id</strong><br>${payload.email_id}</div>
      <div><strong>college_roll_number</strong><br>${payload.college_roll_number}</div>
    </div>
  `;

  responseRoot.appendChild(identityCard);
  responseRoot.appendChild(createBlock("Hierarchies", payload.hierarchies));
  responseRoot.appendChild(createBlock("Invalid Entries", payload.invalid_entries));
  responseRoot.appendChild(createBlock("Duplicate Edges", payload.duplicate_edges));
  responseRoot.appendChild(createBlock("Summary", payload.summary));
}

async function submit() {
  errorBox.textContent = "";
  submitBtn.disabled = true;
  submitBtn.textContent = "Analyzing...";

  try {
    const data = asJsonOrCsv(inputEl.value);
    const url = (apiUrlEl.value || "/bfhl").trim();

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });

    const payload = await res.json();

    if (!res.ok) {
      throw new Error(payload.error || "API request failed");
    }

    renderResponse(payload);
  } catch (error) {
    errorBox.textContent = error.message || "Something went wrong";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Analyze Hierarchies";
  }
}

sampleBtn.addEventListener("click", () => {
  inputEl.value = JSON.stringify(sampleData, null, 2);
});

submitBtn.addEventListener("click", submit);
