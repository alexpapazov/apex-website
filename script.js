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
