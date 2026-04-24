function createIdentity() {
  const fullname = process.env.USER_FULLNAME;
  const dob = process.env.DOB_DDMMYYYY;
  const email = process.env.COLLEGE_EMAIL;
  const rollNumber = process.env.COLLEGE_ROLL_NUMBER;

  if (!fullname || !dob || !email || !rollNumber) {
    throw new Error(
      "Missing required identity env vars: USER_FULLNAME, DOB_DDMMYYYY, COLLEGE_EMAIL, COLLEGE_ROLL_NUMBER"
    );
  }

  return {
    user_id: `${fullname.toLowerCase()}_${dob}`,
    email_id: email,
    college_roll_number: rollNumber,
  };
}

function isValidEdge(trimmedEntry) {
  if (!trimmedEntry) {
    return false;
  }

  if (!/^[A-Z]->[A-Z]$/.test(trimmedEntry)) {
    return false;
  }

  const [parent, child] = trimmedEntry.split("->");
  return parent !== child;
}

function detectCycle(nodes, childrenMap) {
  const state = new Map();

  function dfs(node) {
    state.set(node, 1);
    const children = childrenMap.get(node) || [];

    for (const child of children) {
      if (state.get(child) === 1) {
        return true;
      }

      if (state.get(child) !== 2 && dfs(child)) {
        return true;
      }
    }

    state.set(node, 2);
    return false;
  }

  for (const node of nodes) {
    if (!state.has(node) && dfs(node)) {
      return true;
    }
  }

  return false;
}

function buildTree(root, childrenMap) {
  function recurse(node) {
    const treeChildren = {};
    const children = childrenMap.get(node) || [];

    for (const child of children) {
      treeChildren[child] = recurse(child);
    }

    return treeChildren;
  }

  return {
    [root]: recurse(root),
  };
}

function calculateDepth(root, childrenMap) {
  function depth(node) {
    const children = childrenMap.get(node) || [];
    if (children.length === 0) {
      return 1;
    }

    let maxChildDepth = 0;
    for (const child of children) {
      maxChildDepth = Math.max(maxChildDepth, depth(child));
    }

    return 1 + maxChildDepth;
  }

  return depth(root);
}

function processData(data) {
  const invalidEntries = [];
  const duplicateEdges = [];

  const seenValidEdges = new Set();
  const duplicateRecorded = new Set();

  const uniqueEdgesInOrder = [];

  for (const rawEntry of data) {
    const entryAsString = typeof rawEntry === "string" ? rawEntry : String(rawEntry);
    const trimmed = entryAsString.trim();

    if (!isValidEdge(trimmed)) {
      invalidEntries.push(trimmed);
      continue;
    }

    if (seenValidEdges.has(trimmed)) {
      if (!duplicateRecorded.has(trimmed)) {
        duplicateEdges.push(trimmed);
        duplicateRecorded.add(trimmed);
      }
      continue;
    }

    seenValidEdges.add(trimmed);
    uniqueEdgesInOrder.push(trimmed);
  }

  const parentOf = new Map();
  const acceptedEdges = [];
  const nodeOrder = [];
  const seenNodes = new Set();

  for (const edge of uniqueEdgesInOrder) {
    const [parent, child] = edge.split("->");

    if (parentOf.has(child)) {
      continue;
    }

    parentOf.set(child, parent);
    acceptedEdges.push([parent, child]);

    if (!seenNodes.has(parent)) {
      seenNodes.add(parent);
      nodeOrder.push(parent);
    }

    if (!seenNodes.has(child)) {
      seenNodes.add(child);
      nodeOrder.push(child);
    }
  }

  const directedChildren = new Map();
  const undirected = new Map();
  const childSet = new Set();

  for (const [parent, child] of acceptedEdges) {
    if (!directedChildren.has(parent)) {
      directedChildren.set(parent, []);
    }
    directedChildren.get(parent).push(child);

    childSet.add(child);

    if (!undirected.has(parent)) {
      undirected.set(parent, new Set());
    }
    if (!undirected.has(child)) {
      undirected.set(child, new Set());
    }

    undirected.get(parent).add(child);
    undirected.get(child).add(parent);
  }

  const visited = new Set();
  const components = [];

  for (const startNode of nodeOrder) {
    if (visited.has(startNode)) {
      continue;
    }

    const queue = [startNode];
    visited.add(startNode);
    const componentNodes = [];

    while (queue.length > 0) {
      const node = queue.shift();
      componentNodes.push(node);

      const neighbors = undirected.get(node) || new Set();
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    components.push(componentNodes);
  }

  const hierarchies = [];
  let totalTrees = 0;
  let totalCycles = 0;
  let largestTreeRoot = "";
  let largestTreeDepth = 0;

  for (const componentNodes of components) {
    const componentSet = new Set(componentNodes);

    const componentChildrenMap = new Map();
    for (const node of componentNodes) {
      componentChildrenMap.set(node, []);
    }

    for (const [parent, child] of acceptedEdges) {
      if (componentSet.has(parent) && componentSet.has(child)) {
        componentChildrenMap.get(parent).push(child);
      }
    }

    const roots = componentNodes.filter((node) => {
      for (const [parent, child] of acceptedEdges) {
        if (child === node && componentSet.has(parent)) {
          return false;
        }
      }
      return true;
    });

    const root =
      roots.length > 0
        ? roots.slice().sort((a, b) => a.localeCompare(b))[0]
        : componentNodes.slice().sort((a, b) => a.localeCompare(b))[0];

    const hasCycle = detectCycle(componentNodes, componentChildrenMap);

    if (hasCycle) {
      hierarchies.push({
        root,
        tree: {},
        has_cycle: true,
      });
      totalCycles += 1;
      continue;
    }

    const tree = buildTree(root, componentChildrenMap);
    const depth = calculateDepth(root, componentChildrenMap);

    hierarchies.push({
      root,
      tree,
      depth,
    });

    totalTrees += 1;

    if (
      depth > largestTreeDepth ||
      (depth === largestTreeDepth && (largestTreeRoot === "" || root < largestTreeRoot))
    ) {
      largestTreeDepth = depth;
      largestTreeRoot = root;
    }
  }

  return {
    ...createIdentity(),
    hierarchies,
    invalid_entries: invalidEntries,
    duplicate_edges: duplicateEdges,
    summary: {
      total_trees: totalTrees,
      total_cycles: totalCycles,
      largest_tree_root: largestTreeRoot,
    },
  };
}

module.exports = {
  processData,
};
