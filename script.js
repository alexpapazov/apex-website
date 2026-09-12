// Interactive workflow diagram: click a node, see its description.
const WORKFLOW_NODES = {
  human: {
    title: "Human Operator",
    text: "Provides long-horizon execution and delicate motor control that robots cannot achieve — loading wafers, handling chemicals, operating equipment — while receiving real-time guidance from APEX.",
  },
  mr: {
    title: "Mixed-Reality Goggles",
    text: "The interactive window between human and AI: 8K egocentric video at 32 ms latency, hand and eye tracking, and SLAM-based 3D cleanroom maps stream to the agents, while adaptive 3D overlays render guidance, alerts, and progress in the operator's view.",
  },
  lowlevel: {
    title: "Low-Level Local Agents",
    text: "Fine-tuned local vision-language models handle time-critical tasks: continuous chemical-safety monitoring (alerts within 2 s) and quick wafer characterization during etching (under 1 s per image).",
  },
  highlevel: {
    title: "High-Level Agents",
    text: "Four commercial-VLM agents with ordered roles: Planning generates protocols and SOPs; Context grounds each frame into instruments, materials, and actions; Step-tracking aligns frames to SOP steps; Analysis detects errors, guides next actions, and builds the experiment history.",
  },
  memory: {
    title: "Evolving Memory",
    text: "Within an experiment, agents maintain evolving memories that keep recent operations detailed and condense older ones. Across experiments, protocol designs, logs, and lessons learned accumulate to improve future protocol design.",
  },
  guidance: {
    title: "Real-Time Guidance",
    text: "Stepwise instructions, error corrections, safety warnings, and recovery plans flow back to the operator through the MR interface — closing the perception–reasoning–execution loop.",
  },
};

// Nested loop figure: click a box, description appears below the figure.
const LOOP_STEPS = {
  generate: {
    title: "1. Generate / Update Protocol (outer loop)",
    text: "APEX proposes or revises standard operating procedures using the researcher's goals, prior fabrication data, constraints, and feedback.",
  },
  perform: {
    title: "1. Researcher performs step (inner loop)",
    text: "The researcher carries out the current SOP step in the cleanroom while wearing the mixed-reality headset.",
  },
  observe: {
    title: "2. APEX observes (inner loop)",
    text: "Through the headset, APEX captures live video, hand and eye tracking, equipment status, and wafer status in real time.",
  },
  "analyze-detect": {
    title: "3. Analyze and detect (inner loop)",
    text: "APEX interprets the current step, checks for errors, characterizes the wafer, and monitors safety as the work unfolds.",
  },
  guide: {
    title: "4. Provide real-time guidance (inner loop)",
    text: "APEX delivers instructions, warnings, or parameter updates directly in the operator's view.",
  },
  continue: {
    title: "5. Continue fabrication (inner loop)",
    text: "The researcher proceeds to the next step, and the cycle repeats for every step of the protocol.",
  },
  "analyze-results": {
    title: "2. Analyze results and reason (outer loop)",
    text: "After fabrication, APEX determines what worked, what failed, and why — using explicit constraint reasoning and full traceability.",
  },
  update: {
    title: "3. Update protocol (outer loop)",
    text: "APEX revises SOPs, parameters, or methods — for example proposing an alternative process — and the improved protocol feeds back into the next run.",
  },
};

const figBoxes = document.querySelectorAll(".fig-box");
const figTitle = document.getElementById("fig-detail-title");
const figText = document.getElementById("fig-detail-text");

figBoxes.forEach((box) => {
  box.addEventListener("click", () => {
    figBoxes.forEach((b) => b.classList.remove("active"));
    box.classList.add("active");
    const data = LOOP_STEPS[box.dataset.step];
    if (data) {
      figTitle.textContent = data.title;
      figText.textContent = data.text;
    }
  });
});

const nodes = document.querySelectorAll(".wf-node");
const titleEl = document.getElementById("wf-title");
const textEl = document.getElementById("wf-text");

function selectNode(node) {
  nodes.forEach((n) => n.classList.remove("active"));
  node.classList.add("active");
  const data = WORKFLOW_NODES[node.dataset.node];
  if (data) {
    titleEl.textContent = data.title;
    textEl.textContent = data.text;
  }
}

nodes.forEach((node) => {
  node.addEventListener("click", () => selectNode(node));
  node.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      selectNode(node);
    }
  });
});
