const assert = require("assert");
const { processData } = require("../src/bfhlProcessor");

process.env.USER_FULLNAME = process.env.USER_FULLNAME || "testuser";
process.env.DOB_DDMMYYYY = process.env.DOB_DDMMYYYY || "01012000";
process.env.COLLEGE_EMAIL = process.env.COLLEGE_EMAIL || "test@example.com";
process.env.COLLEGE_ROLL_NUMBER = process.env.COLLEGE_ROLL_NUMBER || "TEST001";

function testProvidedExample() {
  const input = [
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

  const output = processData(input);

  assert.deepStrictEqual(output.invalid_entries, ["hello", "1->2", "A->"]);
  assert.deepStrictEqual(output.duplicate_edges, ["G->H"]);
  assert.strictEqual(output.summary.total_trees, 3);
  assert.strictEqual(output.summary.total_cycles, 1);
  assert.strictEqual(output.summary.largest_tree_root, "A");

  const aHierarchy = output.hierarchies.find((h) => h.root === "A");
  assert.strictEqual(aHierarchy.depth, 4);

  const xHierarchy = output.hierarchies.find((h) => h.root === "X");
  assert.strictEqual(xHierarchy.has_cycle, true);
  assert.deepStrictEqual(xHierarchy.tree, {});
}

function testWhitespaceAndSelfLoop() {
  const output = processData([" A->B ", "A->A", " "]);
  assert.strictEqual(output.invalid_entries.length, 2);
  assert.strictEqual(output.summary.total_trees, 1);
}

function testDuplicateAndMultiParentRules() {
  const output = processData(["A->D", "B->D", "A->D", "D->E"]);

  assert.deepStrictEqual(output.duplicate_edges, ["A->D"]);
  assert.strictEqual(output.summary.total_trees, 1);
  assert.strictEqual(output.summary.total_cycles, 0);

  const treeText = JSON.stringify(output.hierarchies[0].tree);
  assert.ok(treeText.includes("A"));
  assert.ok(!treeText.includes("\"B\""));
}

function testCycleRootFallbackLexicographic() {
  const output = processData(["C->A", "A->B", "B->C"]);
  assert.strictEqual(output.summary.total_cycles, 1);
  assert.strictEqual(output.hierarchies[0].root, "A");
}

try {
  testProvidedExample();
  testWhitespaceAndSelfLoop();
  testDuplicateAndMultiParentRules();
  testCycleRootFallbackLexicographic();
  console.log("All tests passed.");
} catch (err) {
  console.error("Tests failed:", err.message);
  process.exit(1);
}
