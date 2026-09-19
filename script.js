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

// Demo video tiles: hover plays a short pre-sped silent loop, click opens the full video.
const videoModal = document.getElementById("video-modal");
const modalVideo = document.getElementById("video-modal-el");

function openVideo(src) {
  modalVideo.src = src;
  modalVideo.playbackRate = 1;
  videoModal.hidden = false;
  document.body.style.overflow = "hidden";
  modalVideo.play().catch(() => {});
}

function closeVideo() {
  videoModal.hidden = true;
  modalVideo.pause();
  modalVideo.removeAttribute("src");
  modalVideo.load();
  document.body.style.overflow = "";
}

document.querySelectorAll(".fig-video").forEach((tile) => {
  const src = tile.dataset.src;
  if (!src) return;
  const preview = tile.querySelector(".fig-video-el");
  preview.src = tile.dataset.preview || src;

  tile.addEventListener("mouseenter", () => {
    preview.currentTime = 0;
    preview.play().catch(() => {});
  });
  tile.addEventListener("mouseleave", () => {
    preview.pause();
    preview.currentTime = 0;
  });
  tile.addEventListener("click", () => openVideo(src));
});

videoModal.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", closeVideo));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !videoModal.hidden) closeVideo();
});

// Draw continuous connector arrows between the figure's boxes.
const GREEN = "#2f9e50";
const BLUE = "#2f74d0";

function drawWires() {
  const outer = document.querySelector(".fig-split");
  const svg = document.querySelector(".fig-wires");
  if (!outer || !svg) return;

  const W = outer.clientWidth;
  const H = outer.clientHeight;
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);

  const o = outer.getBoundingClientRect();
  const R = (sel) => {
    const r = document.querySelector(sel).getBoundingClientRect();
    return {
      l: r.left - o.left, t: r.top - o.top,
      r: r.right - o.left, b: r.bottom - o.top,
      cx: r.left - o.left + r.width / 2,
      cy: r.top - o.top + r.height / 2,
    };
  };

  const colOuter = R(".fig-col-outer");
  const colInner = R(".fig-col-inner");
  const bridge = R(".fig-bridge");
  const g = R('[data-step="generate"]');
  const ar = R('[data-step="analyze-results"]');
  const up = R('[data-step="update"]');
  const p = R('[data-step="perform"]');
  const ob = R('[data-step="observe"]');
  const ad = R('[data-step="analyze-detect"]');
  const gd = R('[data-step="guide"]');
  const ct = R('[data-step="continue"]');
  const railL = colOuter.l + 18;
  const railR = colInner.r - 18;
  const sideBySide = colInner.l > colOuter.r;

  const wires = [
    // outer loop (blue): top to bottom, then back up the left rail
    [`M ${g.cx} ${g.b} V ${ar.t}`, BLUE],
    [`M ${ar.cx} ${ar.b} V ${up.t}`, BLUE],
    [`M ${up.l} ${up.cy} H ${railL} V ${g.cy} H ${g.l}`, BLUE],
    // inner loop (green): top to bottom, then back up the right rail
    [`M ${p.cx} ${p.b} V ${ob.t}`, GREEN],
    [`M ${ob.cx} ${ob.b} V ${ad.t}`, GREEN],
    [`M ${ad.cx} ${ad.b} V ${gd.t}`, GREEN],
    [`M ${gd.cx} ${gd.b} V ${ct.t}`, GREEN],
    [`M ${ct.r} ${ct.cy} H ${railR} V ${p.cy} H ${p.r}`, GREEN],
  ];
  if (sideBySide) {
    // bridge: protocol flows right, outcomes flow back left
    wires.push([`M ${colOuter.r} ${bridge.cy - 22} H ${colInner.l}`, BLUE]);
    wires.push([`M ${colInner.l} ${bridge.cy + 22} H ${colOuter.r}`, GREEN]);
  } else {
    // stacked (mobile): bridge runs vertically between the two panels
    wires.push([`M ${bridge.cx - 40} ${colOuter.b} V ${colInner.t}`, BLUE]);
    wires.push([`M ${bridge.cx + 40} ${colInner.t} V ${colOuter.b}`, GREEN]);
  }

  const NS = "http://www.w3.org/2000/svg";
  svg.innerHTML = `
    <defs>
      <marker id="arr-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="${GREEN}"/>
      </marker>
      <marker id="arr-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="${BLUE}"/>
      </marker>
    </defs>`;
  wires.forEach(([d, color]) => {
    const path = document.createElementNS(NS, "path");
    path.setAttribute("d", d);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", color);
    path.setAttribute("stroke-width", "2.5");
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("marker-end", color === GREEN ? "url(#arr-green)" : "url(#arr-blue)");
    svg.appendChild(path);
  });
}

window.addEventListener("load", drawWires);
window.addEventListener("resize", drawWires);
drawWires();

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
