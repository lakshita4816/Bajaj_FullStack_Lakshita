require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const { processData } = require("./bfhlProcessor");

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "..", "public")));

app.post("/bfhl", (req, res) => {
  if (!req.is("application/json")) {
    return res.status(415).json({
      error: "Content-Type must be application/json",
    });
  }

  const { data } = req.body || {};

  if (!Array.isArray(data)) {
    return res.status(400).json({
      error: "Request body must be an object with a data array",
    });
  }

  try {
    const response = processData(data);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to process input data",
      details: error.message,
    });
  }
});

app.get("/health", (_, res) => {
  res.json({
    status: "ok",
  });
});

app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
