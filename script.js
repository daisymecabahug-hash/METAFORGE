// ═══════════════════════════════════════════════
// METAFORGE — MAIN SCRIPT
// script.js
// ═══════════════════════════════════════════════

import {
  saveUserToFirestore,
  loadUserProgress,
  observeAuthState,
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  logoutUser
} from './firebase.js';

/* ═══════════════════════════════════════════════
   DATA — LEVELS
═══════════════════════════════════════════════ */
const LEVELS = [
  {
    id: 1,
    bloom: "Remembering",
    color: "#38bdf8",
    icon: "💡",
    tagline: "Recall & Recognize",
    desc: "Construct prompts that ask AI to retrieve, list, or identify factual information. Focus on clarity and precision in defining the scope of recall.",
    task: {
      title: "The Definition Task",
      objective: "Write a prompt that instructs an AI to recall and list key definitions and terminology. Your prompt should specify the domain, the number of terms expected, and the format of the output.",
      prompt: `<span class="hl">// SCENARIO</span>\nYou are studying for an AI literacy exam covering fundamental concepts in machine learning.\n\n<span class="hl2">YOUR TASK:</span>\nWrite a prompt to an AI system that will cause it to generate a structured list of <span class="hl3">10 foundational machine learning terms</span> with their definitions.\n\nYour prompt should specify:\n• The <span class="hl">domain</span> (machine learning fundamentals)\n• The <span class="hl">number</span> of terms (exactly 10)\n• The <span class="hl">format</span> expected for each entry\n• The <span class="hl">difficulty level</span> (beginner-friendly)`,
      instructions: [
        "Write your prompt in a separate document or paper.",
        "Be explicit about exactly what information you want recalled.",
        "Specify the format — numbered list, table, or structured output.",
        "Avoid vague language — the AI should not have to guess what 'foundational' means.",
        "Evaluate your prompt using the rubric below. Focus on Criteria 1 and 5."
      ],
      time: "10–15 min",
      difficulty: "Beginner",
      focus: "Explicitness · Format Guidance"
    }
  },
  {
    id: 2,
    bloom: "Understanding",
    color: "#4ade80",
    icon: "🔍",
    tagline: "Explain & Interpret",
    desc: "Craft prompts that require the AI to summarize, paraphrase, classify, or explain concepts clearly in language appropriate to a specific audience.",
    task: {
      title: "The Concept Translator",
      objective: "Write a prompt that directs an AI to explain a complex concept in accessible language. Your prompt must define the audience, depth of explanation, and use of analogies.",
      prompt: `<span class="hl">// SCENARIO</span>\nYou're creating study material for high school students who have no prior coding experience.\n\n<span class="hl2">YOUR TASK:</span>\nWrite a prompt asking an AI to explain <span class="hl3">how neural networks learn</span> to a non-technical audience.\n\nYour prompt should include:\n• <span class="hl">Audience definition</span> (age group, background)\n• A request for an <span class="hl">analogy</span> to make the concept relatable\n• <span class="hl">Length constraints</span> (e.g., 200–250 words)\n• Instruction to <span class="hl">avoid jargon</span> or define any technical term used\n• A <span class="hl">summary sentence</span> at the end`,
      instructions: [
        "Draft a prompt that specifies audience clearly — don't just say 'explain simply'.",
        "Include explicit instructions about analogies and examples.",
        "Test whether your prompt would produce output a 16-year-old could understand.",
        "Check: Does your prompt address format (paragraph length, no jargon, summary)?",
        "Self-evaluate using Rubric Criteria 1, 2, and 4."
      ],
      time: "15–20 min",
      difficulty: "Beginner–Intermediate",
      focus: "Clarity · Audience Alignment"
    }
  },
  {
    id: 3,
    bloom: "Applying",
    color: "#facc15",
    icon: "⚙️",
    tagline: "Use & Execute",
    desc: "Design prompts that require AI to solve a specific real-world problem by applying known procedures, methods, or domain knowledge in a new context.",
    task: {
      title: "The Problem Solver",
      objective: "Write a prompt that instructs an AI to solve a specific, well-defined problem using domain knowledge. Your prompt should specify context, constraints, and expected solution format.",
      prompt: `<span class="hl">// SCENARIO</span>\nA small business owner needs to reduce customer churn and has asked for an AI-generated action plan.\n\n<span class="hl2">YOUR TASK:</span>\nWrite a prompt instructing an AI to <span class="hl3">create a 30-day customer retention plan</span> for a subscription-based software product.\n\nYour prompt should include:\n• <span class="hl">Role prompting</span> — assign the AI a relevant persona\n• The <span class="hl">business context</span> (type of product, average users, churn rate ~15%)\n• <span class="hl">Specific deliverables</span> (weekly milestones, tactics per week)\n• <span class="hl">Format requirements</span> (structured table or phased plan)\n• A constraint: <span class="hl">budget under $500/month</span>`,
      instructions: [
        "Use role prompting — assign a persona like 'Act as a Customer Success strategist'.",
        "Provide enough context so the AI doesn't make assumptions about the business.",
        "Specify each week's deliverable to break down the 30-day plan.",
        "Include a constraint (budget, time, resources) to sharpen the output.",
        "Evaluate using Rubric Criteria 3 (strategies), 2 (specificity), and 5 (format)."
      ],
      time: "20–25 min",
      difficulty: "Intermediate",
      focus: "Role Prompting · Constraints · Format"
    }
  },
  {
    id: 4,
    bloom: "Analyzing",
    color: "#fb923c",
    icon: "🧩",
    tagline: "Break Down & Compare",
    desc: "Develop prompts that require AI to differentiate, compare, contrast, categorize, or deconstruct complex information into meaningful components.",
    task: {
      title: "The Comparative Analyst",
      objective: "Write a prompt that instructs an AI to analyze and compare two or more subjects across multiple structured dimensions. Your prompt must specify the comparison criteria and output structure.",
      prompt: `<span class="hl">// SCENARIO</span>\nYou are preparing a research brief comparing two competing AI language model approaches for a graduate seminar.\n\n<span class="hl2">YOUR TASK:</span>\nWrite a prompt asking an AI to <span class="hl3">compare GPT-style autoregressive models vs BERT-style masked models</span> across multiple analytical dimensions.\n\nYour prompt must specify:\n• Exactly <span class="hl">which dimensions</span> to compare (e.g., architecture, training objective, use cases, strengths/weaknesses)\n• Output as a <span class="hl">structured comparison table</span> with rows per dimension\n• A <span class="hl">brief analytical paragraph</span> after the table synthesizing key differences\n• A <span class="hl">chain-of-thought directive</span> — ask the AI to reason step-by-step before concluding\n• Minimum <span class="hl">4 comparison dimensions</span>`,
      instructions: [
        "Define each comparison axis explicitly — don't leave any dimension open to interpretation.",
        "Request chain-of-thought: 'Before generating the table, reason through each dimension.'",
        "Specify the output structure: table first, then synthesis paragraph.",
        "Identify which criteria produce genuinely distinct separation between the two subjects.",
        "Evaluate using Rubric Criteria 3 (strategies), 5 (output format), and 6 (cognitive demand)."
      ],
      time: "25–30 min",
      difficulty: "Intermediate–Advanced",
      focus: "Chain-of-Thought · Structured Output · Decomposition"
    }
  },
  {
    id: 5,
    bloom: "Evaluating",
    color: "#a78bfa",
    icon: "⚖️",
    tagline: "Judge & Critique",
    desc: "Engineer prompts that direct AI to judge, assess, rank, or critique outputs based on explicit criteria — producing reasoned evaluative conclusions.",
    task: {
      title: "The Critical Evaluator",
      objective: "Write a prompt that asks an AI to evaluate and rank multiple options against explicit criteria, justify each judgment, and produce a final recommendation with caveats.",
      prompt: `<span class="hl">// SCENARIO</span>\nYour university's computer science department is selecting a programming language to teach first-year students in their intro course.\n\n<span class="hl2">YOUR TASK:</span>\nWrite a prompt asking an AI to <span class="hl3">evaluate and rank Python, JavaScript, and Java</span> as first-year teaching languages.\n\nYour prompt must include:\n• <span class="hl">Five explicit evaluation criteria</span> (e.g., learning curve, ecosystem, employability, readability, tooling)\n• A <span class="hl">weighted scoring instruction</span> — define which criteria matter most\n• Request a <span class="hl">ranked comparison table</span> then a justified final recommendation\n• Ask the AI to <span class="hl">acknowledge counterarguments</span> to its recommendation\n• Include a directive to <span class="hl">cite reasoning</span> for each score given`,
      instructions: [
        "Define all five criteria before asking for evaluation — do not let AI choose criteria.",
        "Assign weights (e.g., 'weight readability 30%, employability 25%...').",
        "Ask for a table AND a recommendation paragraph — test that you specified both.",
        "Require counterarguments — this tests whether your prompt captures evaluative nuance.",
        "Evaluate using Rubric Criteria 2, 4, and 6. This task should score highly on criterion 6."
      ],
      time: "30–35 min",
      difficulty: "Advanced",
      focus: "Weighted Criteria · Justified Reasoning · Counterarguments"
    }
  },
  {
    id: 6,
    bloom: "Creating",
    color: "#f472b6",
    icon: "✨",
    tagline: "Design & Generate",
    desc: "Construct meta-prompts that direct AI to design entirely new artifacts, frameworks, systems, or structured outputs by synthesizing novel combinations of knowledge.",
    task: {
      title: "The Prompt Architect",
      objective: "Write a meta-prompt — a prompt that generates another high-quality prompt. Your meta-prompt must specify all elements of the output prompt including its structure, strategies, format, and evaluation criteria it should satisfy.",
      prompt: `<span class="hl">// SCENARIO</span>\nYou are designing a prompt template library for an educational technology startup. You need to create reusable, high-quality prompts that teachers can deploy for different subjects.\n\n<span class="hl2">YOUR TASK:</span>\nWrite a <span class="hl3">meta-prompt</span> — a prompt that instructs an AI to generate a complete, production-ready prompt template for teaching <span class="hl3">critical thinking skills in high school history</span>.\n\nYour meta-prompt must specify that the generated prompt should include:\n• <span class="hl">Role assignment</span> for the AI (Socratic tutor, debate facilitator, etc.)\n• <span class="hl">Scaffolded sub-questions</span> using decomposition\n• <span class="hl">Format directives</span> (how output should be structured for student use)\n• <span class="hl">Cognitive demand level</span> targeting analysis and evaluation\n• <span class="hl">Modifiable variables</span> marked with [BRACKETS] for teacher customization\n• A built-in <span class="hl">self-evaluation checklist</span> at the end of the template`,
      instructions: [
        "This is a meta-task: your prompt must CREATE another prompt. Think recursively.",
        "Specify exactly what components the output prompt should contain — don't be vague.",
        "Include instructions for using [BRACKET] variables to make the template flexible.",
        "Direct the AI to include a self-evaluation checklist in the generated template.",
        "Evaluate using ALL six rubric criteria — this is the highest-demand task and should target a near-perfect score."
      ],
      time: "40–50 min",
      difficulty: "Expert",
      focus: "Meta-Prompting · Template Design · Synthesis"
    }
  }
];

/* ═══════════════════════════════════════════════
   DATA — RUBRIC
═══════════════════════════════════════════════ */
const RUBRIC = [
  {
    num: 1,
    title: "Clarity of Prompt (Explicitness)",
    desc: "Measures how clearly the prompt defines the task, format, target audience, and constraints. A clear prompt eliminates ambiguity and leaves no room for the AI to make unwanted assumptions.",
    cite: "Jiang et al. (2023) · Reynolds & McDonell (2021)",
    scores: [
      { val: 1, label: "Beginning",  desc: "Vague or incomplete; task, format, and audience are largely undefined." },
      { val: 2, label: "Developing", desc: "Partially clear; some key elements (audience or format) are missing or implied." },
      { val: 3, label: "Proficient", desc: "Clear task and format; audience is specified with minor ambiguities remaining." },
      { val: 4, label: "Exemplary",  desc: "Fully explicit; task, format, audience, and constraints are all precisely defined." }
    ],
    rrl: "<strong>Jiang et al. (2023)</strong> found that explicit task framing in prompts significantly improves LLM output precision. <strong>Reynolds & McDonell (2021)</strong> established that prompt programming — treating prompts as precise specifications — is fundamental to reliable AI behavior."
  },
  {
    num: 2,
    title: "Specificity / Detail of Information Requested",
    desc: "Measures how detailed the prompt is regarding specific sections, subtopics, reasoning steps, or required inclusions. Specificity prevents generic outputs.",
    cite: "Lee et al. (2022) · Benotti & Cusack (2023)",
    scores: [
      { val: 1, label: "Beginning",  desc: "Highly generic; no specific details or subtopics are requested." },
      { val: 2, label: "Developing", desc: "Some detail provided, but major subtopics or expected depth are unspecified." },
      { val: 3, label: "Proficient", desc: "Most key subtopics and expected depth are addressed with specific language." },
      { val: 4, label: "Exemplary",  desc: "All critical subtopics, reasoning steps, and depth requirements are explicitly stated." }
    ],
    rrl: "<strong>Lee et al. (2022)</strong> demonstrated that prompt specificity is the strongest single predictor of AI output quality. <strong>Benotti & Cusack (2023)</strong> identified under-specification as the primary failure mode in novice prompt writing."
  },
  {
    num: 3,
    title: "Use of Prompt Engineering Strategies",
    desc: "Evaluates whether deliberate techniques are applied — including role prompting, decomposition, chain-of-thought reasoning, few-shot examples, or structured output framing.",
    cite: "Shin et al. (2024) · Reynolds & McDonell (2021)",
    scores: [
      { val: 1, label: "Beginning",  desc: "No recognizable prompt engineering strategies present." },
      { val: 2, label: "Developing", desc: "One strategy loosely applied (e.g., basic role assignment without context)." },
      { val: 3, label: "Proficient", desc: "Two or more strategies clearly applied (e.g., role + decomposition, or CoT + format)." },
      { val: 4, label: "Exemplary",  desc: "Three or more strategies skillfully integrated; strategies complement each other coherently." }
    ],
    rrl: "<strong>Shin et al. (2024)</strong> showed that combining multiple structured prompting strategies produces compoundingly better outputs. <strong>Reynolds & McDonell (2021)</strong> formalized the taxonomy of prompt programming strategies for LLMs."
  },
  {
    num: 4,
    title: "Alignment with Task Objectives / Academic Accuracy",
    desc: "Assesses whether the prompt accurately reflects the learning or task objective and would generate academically relevant, factually grounded output.",
    cite: "Anderson & Krathwohl (2001) · Jones & Hindle (2023)",
    scores: [
      { val: 1, label: "Beginning",  desc: "Prompt is misaligned; would not produce output relevant to the stated objective." },
      { val: 2, label: "Developing", desc: "Partially aligned; some elements drift from the objective or invite inaccurate output." },
      { val: 3, label: "Proficient", desc: "Mostly aligned; prompt would produce academically relevant output with minor drift." },
      { val: 4, label: "Exemplary",  desc: "Fully aligned; prompt precisely targets the learning objective and guards against inaccuracy." }
    ],
    rrl: "<strong>Anderson & Krathwohl (2001)</strong> established that learning tasks must be designed to match the intended cognitive level. <strong>Jones & Hindle (2023)</strong> found that misalignment between prompt intent and AI output is amplified when prompts lack objective grounding."
  },
  {
    num: 5,
    title: "Output Structure / Format Guidance",
    desc: "Measures whether the prompt explicitly instructs the AI on output structure — including format type, length, visual organization, or specific output components.",
    cite: "Zhou & Pan (2023) · Jiang et al. (2023)",
    scores: [
      { val: 1, label: "Beginning",  desc: "No format guidance; output structure is left entirely to the AI." },
      { val: 2, label: "Developing", desc: "Minimal format mentioned (e.g., 'write a list') without structural specifics." },
      { val: 3, label: "Proficient", desc: "Format is clearly specified (e.g., 'a numbered table with 4 columns and a summary paragraph')." },
      { val: 4, label: "Exemplary",  desc: "Precise multi-element format instructions; length, sections, and component ordering are all defined." }
    ],
    rrl: "<strong>Zhou & Pan (2023)</strong> found that output format specification is the second most impactful prompt feature after task clarity. <strong>Jiang et al. (2023)</strong> showed that structured output prompts reduce hallucination rates in LLMs."
  },
  {
    num: 6,
    title: "Cognitive Demand / Higher-Order Thinking",
    desc: "Evaluates whether the prompt requires analysis, synthesis, evaluation, or creative generation rather than simple information retrieval or paraphrase.",
    cite: "Anderson & Krathwohl (2001) · Benotti & Cusack (2023)",
    scores: [
      { val: 1, label: "Beginning",  desc: "Recalls only; no analysis, comparison, judgment, or creation required." },
      { val: 2, label: "Developing", desc: "Basic comprehension or application only; no higher-order thinking demanded." },
      { val: 3, label: "Proficient", desc: "Analysis or evaluation present; prompt requires the AI to reason beyond surface-level recall." },
      { val: 4, label: "Exemplary",  desc: "High-order synthesis or meta-cognitive demand; prompt requires generation, critique, or reflective reasoning." }
    ],
    rrl: "<strong>Anderson & Krathwohl (2001)</strong> established that cognitive demand directly predicts learning depth. <strong>Benotti & Cusack (2023)</strong> found that novice prompters rarely exceed comprehension-level cognitive demand."
  }
];

const TAX_DATA = [
  { name: "Remembering",  color: "#38bdf8", width: 16  },
  { name: "Understanding",color: "#4ade80", width: 30  },
  { name: "Applying",     color: "#facc15", width: 48  },
  { name: "Analyzing",    color: "#fb923c", width: 65  },
  { name: "Evaluating",   color: "#a78bfa", width: 82  },
  { name: "Creating",     color: "#f472b6", width: 100 }
];

/* ═══════════════════════════════════════════════
   AUTH UI
═══════════════════════════════════════════════ */
observeAuthState(async (user) => {
  const loginForm = document.getElementById('login-form');
  const userInfo  = document.getElementById('user-info');
  const userEmail = document.getElementById('user-email');

  if (user) {
    loginForm.style.display = 'none';
    userInfo.style.display  = 'flex';
    userEmail.textContent   = `Logged in as: ${user.email}`;
    await saveUserToFirestore(user);
    const data = await loadUserProgress(user.uid);
    if (data) updateUIWithProgress(data);
  } else {
    loginForm.style.display = 'flex';
    userInfo.style.display  = 'none';
  }
});

window.loginEmail = async function () {
  const email    = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    const user = await loginWithEmail(email, password);
    await saveUserToFirestore(user);
    alert('Login successful!');
  } catch (e) { alert('Login failed: ' + e.message); }
};

window.registerEmail = async function () {
  const email    = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    const user = await registerWithEmail(email, password);
    await saveUserToFirestore(user);
    alert('Registration successful! You are now logged in.');
  } catch (e) { alert('Registration failed: ' + e.message); }
};

window.loginGoogle = async function () {
  try {
    const user = await loginWithGoogle();
    await saveUserToFirestore(user);
    alert('Google login successful!');
  } catch (e) {
    if (e.code === 'auth/popup-blocked') {
      alert('Popup was blocked. Please allow popups for this site.');
    } else if (e.code === 'auth/popup-closed-by-user') {
      alert('Google login was cancelled.');
    } else {
      alert('Google login failed: ' + e.message);
    }
  }
};

window.logout = async function () {
  await logoutUser();
  alert('Logged out successfully!');
};

/* ═══════════════════════════════════════════════
   PROGRESS UI
═══════════════════════════════════════════════ */
function updateUIWithProgress(userData) {
  const progress = userData.progress || 0;
  const bar = document.getElementById('progress-bar');
  if (bar) bar.style.width = `${(progress / 6) * 100}%`;

  document.querySelectorAll('.level-card').forEach((card, idx) => {
    if (idx < progress) card.classList.add('completed');
  });

  if (userData.achievements && userData.achievements.length > 0) {
    showAchievement('Welcome back!', 'Continue your progress!');
  }
}

function showAchievement(title, desc) {
  const el = document.getElementById('achievement');
  el.querySelector('.achievement-title').textContent = title;
  el.querySelector('.achievement-desc').textContent  = desc;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3000);
}

/* ═══════════════════════════════════════════════
   RENDER LEVEL CARDS
═══════════════════════════════════════════════ */
const grid = document.getElementById('levels-grid');
LEVELS.forEach((lv, i) => {
  const card = document.createElement('div');
  card.className = 'level-card';
  card.style.setProperty('--card-color', lv.color);
  card.style.animationDelay = `${i * 0.08}s`;
  card.innerHTML = `
    <div class="card-num">${lv.id}</div>
    <div class="card-badge" style="color:${lv.color};background:${lv.color}18;border-color:${lv.color}33;">${lv.icon} Level ${lv.id}</div>
    <div class="card-title">${lv.bloom}</div>
    <div class="card-desc">${lv.tagline} — ${lv.desc}</div>
    <div class="card-arrow" style="color:${lv.color};">Open Task <span>→</span></div>
  `;
  card.addEventListener('click', () => openTask(lv, card));
  grid.appendChild(card);
});

/* ═══════════════════════════════════════════════
   TASK PANEL
═══════════════════════════════════════════════ */
function openTask(lv, card) {
  document.querySelectorAll('.level-card').forEach(c => c.classList.remove('active'));
  card.classList.add('active');

  const panel = document.getElementById('task-panel');
  panel.style.setProperty('--tl-color', lv.color);
  panel.classList.add('visible');

  // Badge & title
  const badge = document.getElementById('tp-badge');
  badge.textContent       = `Level ${lv.id} · ${lv.bloom}`;
  badge.style.color       = lv.color;
  badge.style.borderColor = lv.color + '55';
  badge.style.background  = lv.color + '18';
  document.getElementById('tp-title').textContent = lv.task.title;

  // Progress steps
  const prog = document.getElementById('tp-progress');
  prog.innerHTML = '';
  for (let i = 1; i <= 6; i++) {
    const s = document.createElement('div');
    s.className = `progress-step${i <= lv.id ? ' done' : ''}`;
    if (i <= lv.id) s.style.background = lv.color;
    prog.appendChild(s);
  }

  // Objective
  document.getElementById('tp-objective').innerHTML =
    `<strong>🎯 Learning Objective</strong>${lv.task.objective}`;

  // Prompt box
  document.getElementById('tp-prompt').innerHTML =
    lv.task.prompt.replace(/\n/g, '<br>');

  // Instructions
  document.getElementById('tp-instructions').innerHTML =
    `<h4>// How to Approach This Task</h4>
     <ul class="instruction-list">${lv.task.instructions.map(i => `<li>${i}</li>`).join('')}</ul>`;

  // Meta chips
  document.getElementById('tp-meta').innerHTML = `
    <div class="meta-chip">⏱ Estimated Time: <span>${lv.task.time}</span></div>
    <div class="meta-chip">🎚 Difficulty: <span>${lv.task.difficulty}</span></div>
    <div class="meta-chip">🔑 Focus Areas: <span>${lv.task.focus}</span></div>
  `;

  setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
}

window.closeTask = function () {
  document.getElementById('task-panel').classList.remove('visible');
  document.querySelectorAll('.level-card').forEach(c => c.classList.remove('active'));
};

/* ═══════════════════════════════════════════════
   RENDER RUBRIC
═══════════════════════════════════════════════ */
const rubricGrid = document.getElementById('rubric-grid');
RUBRIC.forEach((r, i) => {
  const card = document.createElement('div');
  card.className = 'rubric-card';
  card.style.animationDelay = `${i * 0.07}s`;
  card.innerHTML = `
    <div class="rubric-header" onclick="toggleRubric(this)">
      <div class="rubric-header-left">
        <div class="rubric-num">${r.num}</div>
        <div>
          <div class="rubric-title">${r.title}</div>
          <div class="rubric-cite">${r.cite}</div>
        </div>
      </div>
      <div class="rubric-toggle">▾</div>
    </div>
    <div class="rubric-body">
      <p class="rubric-desc">${r.desc}</p>
      <div class="score-grid">
        ${r.scores.map(s => `
          <div class="score-cell">
            <div class="score-val s${s.val}">${s.val}</div>
            <div class="score-label">${s.label}</div>
            <div class="score-desc">${s.desc}</div>
          </div>
        `).join('')}
      </div>
      <div class="rrl-block">
        <div class="rrl-label">Research Basis (RRL)</div>
        <div class="rrl-cite">${r.rrl}</div>
      </div>
    </div>
  `;
  rubricGrid.appendChild(card);
});

window.toggleRubric = function (header) {
  header.parentElement.classList.toggle('expanded');
};

/* ═══════════════════════════════════════════════
   TAXONOMY VISUAL
═══════════════════════════════════════════════ */
const taxVis = document.getElementById('tax-visual');
TAX_DATA.forEach((t, i) => {
  const row = document.createElement('div');
  row.className = 'tax-item';
  row.style.animationDelay = `${i * 0.1}s`;
  row.innerHTML = `
    <div class="tax-name" style="color:${t.color}">${t.name}</div>
    <div class="tax-bar-wrap">
      <div class="tax-bar" style="width:0;background:${t.color};transition:width 1s ${i * 0.15}s ease"></div>
    </div>
    <div class="tax-level" style="color:${t.color}">L${i + 1}</div>
  `;
  taxVis.appendChild(row);
});

// Animate bars on scroll into view
const taxObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.tax-bar').forEach((bar, i) => {
        bar.style.width = TAX_DATA[i].width + '%';
      });
      taxObserver.disconnect();
    }
  });
}, { threshold: 0.3 });
taxObserver.observe(document.getElementById('tax-visual'));

/* ═══════════════════════════════════════════════
   SCROLL ANIMATIONS
═══════════════════════════════════════════════ */
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity   = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.level-card, .rubric-card').forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  animObserver.observe(el);
});
