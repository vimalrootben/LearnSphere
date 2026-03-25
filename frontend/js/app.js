/* ═══════════════════════════════════════
   LEARNSPHERE – Main Application Logic
   ═══════════════════════════════════════ */

// ─── STATE ───
let currentUser = { name: 'Learner', onboardingComplete: false, progress: {}, completedTopics: [] };
let learningPath = null;

// ─── INIT ───
window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('ls_user');
  if (saved) {
    currentUser = JSON.parse(saved);
  } else {
    localStorage.setItem('ls_user', JSON.stringify(currentUser));
  }
  
  if (currentUser.onboardingComplete) {
    showPage('app');
    loadDashboard();
  } else {
    showPage('onboarding');
  }

  setupDomainDropdown();
  renderDomainGrid();

  // Init shared chat engine
  loadChatThreads();
  renderThreadList();
  renderChatMessages();
  renderMiniChat();
});

// ─── PAGE NAVIGATION ───
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('page-' + id);
  if (page) page.classList.add('active');
}

function showTab(tabId) {
  document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));
  const tab = document.getElementById('tab-' + tabId);
  if (tab) tab.classList.add('active');
  // Update nav
  document.querySelectorAll('.header-nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.mobile-nav-btn').forEach(b => b.classList.remove('active'));
  const hBtn = document.getElementById('hnav-' + tabId);
  const mBtn = document.getElementById('mnav-' + tabId);
  if (hBtn) hBtn.classList.add('active');
  if (mBtn) mBtn.classList.add('active');
}

// ─── TOAST ───
function showToast(msg, type = '', duration = 5000) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast ' + type;
  toast.innerHTML = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}

// Removed auth and password code

// ─── ONBOARDING ───
const CAREER_MAP = {
  "Core IT & Software": ["Full Stack Developer", "Backend Developer", "Mobile App Developer", "DevOps Engineer", "QA Engineer"],
  "Data & Analytics": ["Data Analyst", "Data Scientist", "BI Developer"],
  "Cloud Computing": ["Cloud Architect", "Cloud Engineer", "DevOps Engineer"],
  "Cybersecurity": ["Security Analyst", "Ethical Hacker", "SOC Analyst"],
  "AI & Machine Learning": ["ML Engineer", "AI Researcher", "NLP Engineer"],
  "Networking & Infrastructure": ["Network Engineer", "Systems Administrator"],
  "Business + Tech": ["Product Manager", "Business Analyst", "Scrum Master"],
  "Creative & Design": ["UI/UX Designer", "Graphic Designer"],
  "Career Development": ["Resume Builder", "Interview Prep Specialist"],
  "Software Engineering": ["Full Stack Developer", "Backend Developer", "DevOps Engineer", "QA Engineer"]
};

const CERT_MAP = {
  "Cloud Computing|Cloud Architect": ["AWS Solutions Architect", "Azure Administrator", "Google Cloud Professional"],
  "Cloud Computing|Cloud Engineer": ["AWS Cloud Practitioner", "Azure Fundamentals", "Google Cloud Professional"],
  "Cloud Computing|DevOps Engineer": ["AWS DevOps Professional", "Azure DevOps Engineer", "Google Cloud Professional"],
  "Cybersecurity|Security Analyst": ["CompTIA Security+", "CEH", "CISSP"],
  "Cybersecurity|Ethical Hacker": ["CEH", "OSCP", "CompTIA PenTest+"],
  "Cybersecurity|SOC Analyst": ["CompTIA Security+", "CISSP", "CompTIA CySA+"],
  "Data & Analytics|Data Analyst": ["Google Data Analytics", "Microsoft DP-900", "IBM Data Science"],
  "Data & Analytics|Data Scientist": ["IBM Data Science", "Google Data Analytics", "Microsoft DP-900"],
  "Data & Analytics|BI Developer": ["Microsoft PL-300", "Tableau Desktop Specialist", "Google Data Analytics"],
  "AI & Machine Learning|ML Engineer": ["TensorFlow Developer", "AWS ML Specialty", "Azure AI Engineer"],
  "AI & Machine Learning|AI Researcher": ["TensorFlow Developer", "Azure AI Engineer", "Google Cloud ML Engineer"],
  "AI & Machine Learning|NLP Engineer": ["TensorFlow Developer", "Azure AI Engineer", "AWS ML Specialty"],
  "Networking & Infrastructure|Network Engineer": ["CCNA", "CompTIA Network+", "Juniper JNCIA"],
  "Networking & Infrastructure|Systems Administrator": ["CompTIA Server+", "MCSA", "Red Hat RHCSA"],
  "Core IT & Software|Full Stack Developer": ["Meta Frontend Developer", "AWS Cloud Practitioner", "Google UX Design"],
  "Core IT & Software|Backend Developer": ["AWS Cloud Practitioner", "Meta Backend Developer", "Azure Fundamentals"],
  "Core IT & Software|Mobile App Developer": ["Google Associate Android Developer", "Meta React Native", "AWS Cloud Practitioner"],
  "Core IT & Software|DevOps Engineer": ["AWS DevOps Professional", "Azure DevOps Engineer", "Docker Certified Associate"],
  "Core IT & Software|QA Engineer": ["ISTQB Foundation", "CompTIA A+", "Selenium Certification"],
  "Software Engineering|Full Stack Developer": ["Meta Frontend Developer", "AWS Cloud Practitioner", "Azure Fundamentals"],
  "Software Engineering|Backend Developer": ["AWS Cloud Practitioner", "Meta Backend Developer", "Azure Fundamentals"],
  "Software Engineering|DevOps Engineer": ["AWS DevOps Professional", "Azure DevOps Engineer", "Docker Certified Associate"],
  "Software Engineering|QA Engineer": ["ISTQB Foundation", "Selenium Certification", "CompTIA A+"],
  "Business + Tech|Product Manager": ["PMP", "Scrum Master", "CAPM"],
  "Business + Tech|Business Analyst": ["CBAP", "PMI-PBA", "IIBA ECBA"],
  "Business + Tech|Scrum Master": ["PSM I", "CSM", "SAFe Scrum Master"],
  "Creative & Design|UI/UX Designer": ["Google UX Design", "Adobe Certified Professional", "Interaction Design Foundation"],
  "Creative & Design|Graphic Designer": ["Adobe Certified Professional", "Canva Design Certificate", "Google UX Design"],
  "Career Development|Resume Builder": ["LinkedIn Learning Certificate", "Google Career Certificate", "Coursera Professional Certificate"],
  "Career Development|Interview Prep Specialist": ["Google Career Certificate", "LinkedIn Learning Certificate", "HackerRank Certificate"]
};

function setupDomainDropdown() {
  const domainSel = document.getElementById('ob-domain');
  const goalSel = document.getElementById('ob-goal');
  const certSel = document.getElementById('ob-cert');
  const btn1 = document.getElementById('btn-ob1');
  const btn2 = document.getElementById('btn-ob2');

  domainSel.addEventListener('change', () => {
    btn1.disabled = !domainSel.value;
  });
  goalSel.addEventListener('change', () => {
    btn2.disabled = !goalSel.value;
    // Update certs
    if (goalSel.value) {
      const key = domainSel.value + '|' + goalSel.value;
      const certs = CERT_MAP[key] || ["General Certification"];
      certSel.innerHTML = '<option value="">Select a certification</option>';
      certs.forEach(c => { const o = document.createElement('option'); o.value = c; o.textContent = c; certSel.appendChild(o); });
    }
  });
}

function obNext(step) {
  if (step === 1) {
    const domain = document.getElementById('ob-domain').value;
    if (!domain) return;
    // Populate career goals
    const goalSel = document.getElementById('ob-goal');
    const goals = CAREER_MAP[domain] || [];
    goalSel.innerHTML = '<option value="">Select a career goal</option>';
    goals.forEach(g => { const o = document.createElement('option'); o.value = g; o.textContent = g; goalSel.appendChild(o); });
    document.getElementById('btn-ob2').disabled = true;
    setOnboardStep(2);
  } else if (step === 2) {
    const goal = document.getElementById('ob-goal').value;
    if (!goal) return;
    setOnboardStep(3);
  }
}

function obBack(step) {
  setOnboardStep(step - 1);
}

function setOnboardStep(step) {
  [1, 2, 3].forEach(s => {
    document.getElementById('ob-step' + s).classList.toggle('hidden', s !== step);
    const dot = document.getElementById('sdot' + s);
    dot.classList.remove('active', 'done');
    if (s < step) dot.classList.add('done');
    else if (s === step) dot.classList.add('active');
  });
  const line1 = document.getElementById('sline1');
  const line2 = document.getElementById('sline2');
  if (line1) line1.classList.toggle('done', step > 1);
  if (line2) line2.classList.toggle('done', step > 2);
}

async function submitOnboarding() {
  const domain = document.getElementById('ob-domain').value;
  const goal = document.getElementById('ob-goal').value;
  const cert = document.getElementById('ob-cert').value;
  const errEl = document.getElementById('ob-error');
  const btn = document.getElementById('btn-ob-finish');

  if (!cert) return showError(errEl, 'Please select a certification.');
  hideError(errEl);

  btn.disabled = true;
  const originalText = btn.innerHTML;
  btn.innerHTML = '⚙️ Generating AI Path...';

  try {
    learningPath = await generateAILearningPath(domain, goal, cert);
  } catch (e) {
    console.error("AI Generation failed, falling back to local template.", e);
    showToast('⚠️ AI generation failed. Using default template.', 'error', 3000);
    learningPath = generateLearningPathLocal(domain, goal, cert);
  }

  currentUser.domain = domain;
  currentUser.careerGoal = goal;
  currentUser.certification = cert;
  currentUser.onboardingComplete = true;
  currentUser.completedTopics = [];
  currentUser.progress = {};
  currentUser.learningPath = learningPath;
  
  localStorage.setItem('ls_user', JSON.stringify(currentUser));

  showToast('🚀 Profile saved! Your learning path is ready.', 'success');
  
  btn.disabled = false;
  btn.innerHTML = originalText;
  
  showPage('app');
  loadDashboard();
}

// ─── LEARNING PATH GENERATOR (via secure backend) ───
async function generateAILearningPath(domain, goal, cert) {
  const res = await fetch('/api/generate-path', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ domain, goal, certification: cert })
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);

  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Unknown error');

  return {
    goal,
    certification: cert,
    phases: data.phases
  };
}

function generateLearningPathLocal(domain, goal, cert) {
  const phaseTemplates = {
    "Cloud Computing": [
      { name: "Cloud Foundations", icon: "☁️", hours: 12, topics: ["Cloud Concepts & Models", "Virtualization Basics", "Shared Responsibility Model"] },
      { name: "Core Services", icon: "⚙️", hours: 15, topics: ["Compute Services (VMs, Containers)", "Storage Solutions", "Networking & VPC"] },
      { name: "Security & Identity", icon: "🔒", hours: 10, topics: ["IAM & Access Control", "Encryption & Key Management", "Compliance Frameworks"] },
      { name: "Architecture & Exam Prep", icon: "🏗️", hours: 14, topics: ["High Availability Design", "Cost Optimization", "Practice Exams"] }
    ],
    "Cybersecurity": [
      { name: "Security Fundamentals", icon: "🛡️", hours: 10, topics: ["CIA Triad & Risk Models", "Cryptography Basics", "Network Security"] },
      { name: "Threats & Vulnerabilities", icon: "⚠️", hours: 12, topics: ["Malware Types", "Social Engineering", "OWASP Top 10"] },
      { name: "Defense & Monitoring", icon: "📡", hours: 14, topics: ["Firewalls & IDS/IPS", "SIEM Tools", "Incident Response"] },
      { name: "Compliance & Exam Prep", icon: "📋", hours: 10, topics: ["Regulatory Compliance", "Security Policies", "Practice Exams"] }
    ],
    "Data & Analytics": [
      { name: "Data Foundations", icon: "📊", hours: 10, topics: ["Statistics Basics", "Data Types & Formats", "SQL Fundamentals"] },
      { name: "Data Processing", icon: "🔄", hours: 12, topics: ["Python for Data", "Pandas & NumPy", "Data Cleaning"] },
      { name: "Visualization & Analysis", icon: "📈", hours: 12, topics: ["Matplotlib & Seaborn", "Dashboard Design", "Exploratory Data Analysis"] },
      { name: "Advanced & Exam Prep", icon: "🎯", hours: 14, topics: ["Machine Learning Basics", "Big Data Concepts", "Practice Exams"] }
    ],
    "AI & Machine Learning": [
      { name: "ML Foundations", icon: "🧠", hours: 12, topics: ["Python Fundamentals", "Linear Algebra & Statistics", "Supervised Learning"] },
      { name: "Deep Learning", icon: "🤖", hours: 15, topics: ["Neural Networks", "CNNs & Image Classification", "RNNs & Sequence Models"] },
      { name: "Specialized ML", icon: "🔬", hours: 14, topics: ["NLP Fundamentals", "Transfer Learning", "Model Optimization"] },
      { name: "Deployment & Exam Prep", icon: "🚀", hours: 12, topics: ["MLOps Basics", "Model Serving", "Practice Exams"] }
    ],
    "Core IT & Software": [
      { name: "Programming Basics", icon: "💻", hours: 10, topics: ["HTML & CSS", "JavaScript Fundamentals", "Git & Version Control"] },
      { name: "Frontend Development", icon: "🎨", hours: 14, topics: ["React Basics", "State Management", "Responsive Design"] },
      { name: "Backend Development", icon: "⚙️", hours: 14, topics: ["Node.js & Express", "REST APIs", "Databases (SQL & NoSQL)"] },
      { name: "Full Stack & Exam Prep", icon: "🏗️", hours: 12, topics: ["Authentication & Security", "Deployment", "Practice Projects"] }
    ],
    "Networking & Infrastructure": [
      { name: "Network Basics", icon: "🌐", hours: 10, topics: ["OSI Model", "TCP/IP", "IP Addressing & Subnetting"] },
      { name: "Routing & Switching", icon: "🔀", hours: 14, topics: ["Router Configuration", "VLANs", "Routing Protocols"] },
      { name: "Network Services", icon: "📡", hours: 12, topics: ["DNS & DHCP", "NAT & ACLs", "Wireless Networking"] },
      { name: "Security & Exam Prep", icon: "🔒", hours: 10, topics: ["Network Security", "VPN Configuration", "Practice Exams"] }
    ]
  };

  const defaultPhases = [
    { name: "Fundamentals", icon: "📚", hours: 10, topics: ["Core Concepts", "Terminology & Frameworks", "Tools & Environment Setup"] },
    { name: "Intermediate Skills", icon: "🔧", hours: 14, topics: ["Hands-on Practice", "Problem Solving", "Case Studies"] },
    { name: "Advanced Topics", icon: "🚀", hours: 14, topics: ["Specialization", "Best Practices", "Real-world Projects"] },
    { name: "Exam Preparation", icon: "🎯", hours: 10, topics: ["Review & Summary", "Mock Tests", "Practice Exams"] }
  ];

  const phases = phaseTemplates[domain] || defaultPhases;
  return {
    goal,
    certification: cert,
    phases: phases.map((p, i) => ({
      ...p,
      phaseNum: i + 1,
      status: 'not-started',
      topicStatus: p.topics.map(() => ({ completed: false, quizPassed: false }))
    }))
  };
}

// ─── DASHBOARD ───
function loadDashboard() {
  if (!currentUser) return;
  // Load saved path
  if (!learningPath && currentUser.learningPath) learningPath = currentUser.learningPath;
  if (!learningPath) return;

  // Header
  document.getElementById('header-avatar').textContent = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U';
  document.getElementById('header-user-name').textContent = currentUser.name || 'User';

  // Hero
  document.getElementById('hero-goal').textContent = currentUser.careerGoal || 'Career';
  document.getElementById('hero-desc').textContent = `Based on your skill gap analysis, we've built a roadmap tailored for ${currentUser.certification}.`;
  document.getElementById('meter-cert').textContent = currentUser.certification || 'Certification';

  // Cert logos
  const logosEl = document.getElementById('hero-cert-logos');
  const logoMap = {
    "Cloud Computing": ["☁️ AWS", "🔷 Azure", "🌐 GCP"],
    "Cybersecurity": ["🛡️ CompTIA", "🔐 CEH", "🔒 CISSP"],
    "Data & Analytics": ["📊 Google", "🔷 Microsoft", "📈 IBM"],
    "AI & Machine Learning": ["🧠 TensorFlow", "☁️ AWS", "🔷 Azure"],
    "Networking & Infrastructure": ["🌐 Cisco", "📡 CompTIA", "🔌 Juniper"],
    "Core IT & Software": ["⚡ Meta", "☁️ AWS", "🎨 Google"]
  };
  const logos = logoMap[currentUser.domain] || ["🎓 Learn", "📚 Study", "🏆 Certify"];
  logosEl.innerHTML = logos.map(l => `<span class="cert-logo">${l}</span>`).join('');

  // Progress
  updateProgress();

  // Timeline cards
  renderTimeline();

  // Roadmap
  renderRoadmap();
}

function updateProgress() {
  if (!learningPath) return;
  let total = 0, completed = 0, totalHours = 0;
  learningPath.phases.forEach(p => {
    totalHours += p.hours;
    p.topics.forEach((_, ti) => {
      total++;
      if (p.topicStatus[ti].quizPassed) completed++;
    });
  });

  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Animate meter
  const meterFill = document.getElementById('meter-fill');
  const meterPct = document.getElementById('meter-pct');
  const circumference = 427;
  const offset = circumference - (circumference * pct / 100);
  setTimeout(() => { meterFill.style.strokeDashoffset = offset; }, 100);
  animateCounter(meterPct, pct);

  // Stats
  document.getElementById('stat-completed').textContent = completed;
  document.getElementById('stat-remaining').textContent = total - completed;
  document.getElementById('stat-phases').textContent = learningPath.phases.length;
  document.getElementById('stat-hours').textContent = totalHours + 'h';
}

function animateCounter(el, target) {
  let current = 0;
  const step = Math.max(1, Math.floor(target / 30));
  const interval = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(interval); }
    el.textContent = current + '%';
  }, 30);
}

function renderTimeline() {
  const container = document.getElementById('timeline-cards');
  if (!learningPath) { container.innerHTML = ''; return; }

  container.innerHTML = learningPath.phases.map((p, pi) => {
    // Determine status
    let status = 'not-started';
    const completedCount = p.topicStatus.filter(t => t.quizPassed).length;
    if (completedCount === p.topics.length) status = 'completed';
    else if (completedCount > 0) status = 'in-progress';

    const statusLabels = { 'not-started': 'Not Started', 'in-progress': 'In Progress', 'completed': 'Completed' };

    return `
      <div class="phase-card" onclick="openPhaseModal(${pi})">
        <span class="phase-icon">${p.icon}</span>
        <span class="phase-num">Phase ${p.phaseNum}</span>
        <div class="phase-name">${p.name}</div>
        <div class="phase-time">⏱️ ${p.hours} hours • ${p.topics.length} topics</div>
        <span class="phase-status ${status}">${statusLabels[status]}</span>
        <button class="btn btn-primary btn-sm" style="margin-top:12px;" onclick="event.stopPropagation(); openPhaseModal(${pi})">Start Learning</button>
      </div>
    `;
  }).join('');
}

function renderRoadmap() {
  const container = document.getElementById('roadmap-container');
  const empty = document.getElementById('roadmap-empty');
  const label = document.getElementById('roadmap-goal-label');

  if (!learningPath) { container.innerHTML = ''; empty.style.display = 'block'; return; }
  empty.style.display = 'none';
  label.textContent = `${currentUser.careerGoal} → ${currentUser.certification}`;

  container.innerHTML = learningPath.phases.map((p, pi) => {
    const completedCount = p.topicStatus.filter(t => t.quizPassed).length;
    let nodeClass = '';
    if (completedCount === p.topics.length) nodeClass = 'done';
    else if (completedCount > 0) nodeClass = 'active';

    return `
      <div class="roadmap-node ${nodeClass}">
        <div class="roadmap-card">
          <h3>${p.icon} Phase ${p.phaseNum}: ${p.name}</h3>
          <div class="rm-duration">⏱️ ${p.hours} hours estimated</div>
          <div class="roadmap-topics">
            ${p.topics.map((t, ti) => `<span class="rm-topic ${p.topicStatus[ti].quizPassed ? 'done' : ''}">${t}</span>`).join('')}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ─── PHASE LEARNING MODAL ───
function openPhaseModal(phaseIdx) {
  const phase = learningPath.phases[phaseIdx];
  const modal = document.getElementById('phase-modal');
  const body = document.getElementById('phase-modal-body');

  body.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
      <h2>${phase.icon} Phase ${phase.phaseNum}: ${phase.name}</h2>
      <button onclick="closePhaseModal()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:var(--text-muted);">✕</button>
    </div>
    <div id="phase-topics-list">
      ${phase.topics.map((topic, ti) => {
        const done = phase.topicStatus[ti].quizPassed;
        return `
          <div style="padding:16px;border:2px solid ${done ? 'var(--accent)' : 'var(--border)'};border-radius:var(--radius-md);margin-bottom:12px;background:${done ? 'var(--accent-light)' : 'var(--white)'};">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <div>
                <strong>${done ? '✅' : '📘'} ${topic}</strong>
                <div style="font-size:0.82rem;color:var(--text-muted);margin-top:4px;">${done ? 'Completed' : 'Not started'}</div>
              </div>
              ${done ? '<span class="phase-status completed">Passed</span>' : `<button class="btn btn-primary btn-sm" onclick="startTopicQuiz(${phaseIdx}, ${ti})" style="width:auto;">Start Quiz</button>`}
            </div>
          </div>
        `;
      }).join('')}
    </div>
    <div style="margin-top:16px;padding:16px;background:var(--bg);border-radius:var(--radius-md);">
      <strong>📊 Phase Progress:</strong> ${phase.topicStatus.filter(t => t.quizPassed).length} / ${phase.topics.length} topics completed
    </div>
  `;

  modal.classList.remove('hidden');
}

function closePhaseModal() {
  document.getElementById('phase-modal').classList.add('hidden');
}

// ─── TOPIC QUIZ ───
let currentQuiz = { phaseIdx: 0, topicIdx: 0, questions: [], current: 0, answers: [] };

function startTopicQuiz(phaseIdx, topicIdx) {
  closePhaseModal();
  showTab('mocktest');

  const topic = learningPath.phases[phaseIdx].topics[topicIdx];
  let questions = QUIZ_DATA[topic] || QUIZ_DATA["Default"];
  questions = [...questions].sort(() => Math.random() - 0.5).slice(0, 10);

  currentQuiz = { phaseIdx, topicIdx, questions, current: 0, answers: new Array(questions.length).fill(-1), topicName: topic };

  document.getElementById('test-start').classList.add('hidden');
  document.getElementById('test-results').classList.add('hidden');
  const area = document.getElementById('test-area');
  area.classList.remove('hidden');

  renderQuizQuestion();
}

function startMockTest() {
  if (!learningPath) { showToast('⚠️ Please complete onboarding first.', 'error'); return; }
  const cert = currentUser.certification;
  const questions = getQuizForCert(cert);

  currentQuiz = { phaseIdx: -1, topicIdx: -1, questions, current: 0, answers: new Array(questions.length).fill(-1), topicName: cert };

  document.getElementById('test-start').classList.add('hidden');
  document.getElementById('test-results').classList.add('hidden');
  const area = document.getElementById('test-area');
  area.classList.remove('hidden');

  renderQuizQuestion();
}

function renderQuizQuestion() {
  const area = document.getElementById('test-area');
  const q = currentQuiz.questions[currentQuiz.current];
  const total = currentQuiz.questions.length;
  const num = currentQuiz.current + 1;

  area.innerHTML = `
    <div class="quiz-progress">
      <div class="quiz-progress-text">Question ${num} of ${total}</div>
      <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${(num / total) * 100}%"></div></div>
    </div>
    <div class="question-card">
      <div class="q-number">Question ${num}</div>
      <div class="q-text">${q.q}</div>
      <div class="q-options">
        ${q.o.map((opt, oi) => `<div class="q-option" onclick="selectAnswer(${oi})" id="qopt-${oi}">${opt}</div>`).join('')}
      </div>
    </div>
    <div style="text-align:center;margin-top:16px;">
      <button class="btn btn-primary btn-sm" id="btn-next-q" onclick="nextQuestion()" style="width:auto;display:none;">
        ${num < total ? 'Next Question →' : 'Submit Answers'}
      </button>
    </div>
  `;
}

function selectAnswer(idx) {
  currentQuiz.answers[currentQuiz.current] = idx;
  document.querySelectorAll('.q-option').forEach((el, i) => {
    el.classList.toggle('selected', i === idx);
  });
  document.getElementById('btn-next-q').style.display = 'inline-flex';
}

function nextQuestion() {
  if (currentQuiz.answers[currentQuiz.current] === -1) return;

  if (currentQuiz.current < currentQuiz.questions.length - 1) {
    currentQuiz.current++;
    renderQuizQuestion();
  } else {
    showQuizResults();
  }
}

function showQuizResults() {
  let correct = 0;
  currentQuiz.questions.forEach((q, i) => {
    if (currentQuiz.answers[i] === q.a) correct++;
  });

  const total = currentQuiz.questions.length;
  const passed = correct >= 8;

  // Update progress if topic quiz
  if (currentQuiz.phaseIdx >= 0 && passed) {
    learningPath.phases[currentQuiz.phaseIdx].topicStatus[currentQuiz.topicIdx].quizPassed = true;
    currentUser.learningPath = learningPath;
    localStorage.setItem('ls_user', JSON.stringify(currentUser));
    updateProgress();
    renderTimeline();
    renderRoadmap();
  }

  document.getElementById('test-area').classList.add('hidden');
  const results = document.getElementById('test-results');
  results.classList.remove('hidden');

  results.innerHTML = `
    <div class="result-card">
      <div class="result-icon">${passed ? '🎉' : '😅'}</div>
      <h3>${passed ? 'Congratulations! You Passed!' : 'Not Quite There Yet'}</h3>
      <div class="result-score">${correct}/${total}</div>
      <p style="color:var(--text-secondary);margin-bottom:20px;">
        ${passed ? 'Great job! You\'ve mastered this topic.' : 'You need 8/10 to pass. Review the material and try again.'}
      </p>
      <div id="result-review" style="text-align:left;margin-bottom:24px;">
        ${currentQuiz.questions.map((q, i) => {
          const isCorrect = currentQuiz.answers[i] === q.a;
          return `
            <div class="review-item">
              <div class="review-q">${i + 1}. ${q.q}</div>
              <div class="review-a ${isCorrect ? 'correct' : 'wrong'}">
                Your answer: ${q.o[currentQuiz.answers[i]] || 'None'} ${isCorrect ? '✅' : `❌ (Correct: ${q.o[q.a]})`}
              </div>
            </div>
          `;
        }).join('')}
      </div>
      <div style="display:flex;gap:12px;justify-content:center;">
        ${!passed && currentQuiz.phaseIdx >= 0 ? `<button class="btn btn-primary btn-sm" onclick="startTopicQuiz(${currentQuiz.phaseIdx}, ${currentQuiz.topicIdx})" style="width:auto;">🔄 Retry Quiz</button>` : ''}
        <button class="btn btn-outline btn-sm" onclick="resetTest()" style="width:auto;">Back to Dashboard</button>
      </div>
    </div>
  `;
}

function resetTest() {
  document.getElementById('test-area').classList.add('hidden');
  document.getElementById('test-results').classList.add('hidden');
  document.getElementById('test-start').classList.remove('hidden');
  showTab('dashboard');
}

// ─── DOMAIN EXPLORER ───
function renderDomainGrid() {
  if (typeof DOMAIN_DATA === 'undefined') return;
  const grid = document.getElementById('domain-grid');
  if (!grid) return;

  grid.innerHTML = DOMAIN_DATA.map((d, i) => `
    <div class="domain-card" onclick="openDomain(${i})">
      <span class="d-icon">${d.icon}</span>
      <div class="d-title">${d.title}</div>
      <div class="d-desc">${d.description}</div>
    </div>
  `).join('');
}

function openDomain(idx) {
  const domain = DOMAIN_DATA[idx];
  showTab('subdomains');

  document.getElementById('subdomain-breadcrumbs').innerHTML = `<a href="#" onclick="showTab('domains'); return false;">Home</a> &gt; ${domain.title}`;
  document.getElementById('subdomain-title').textContent = domain.icon + ' ' + domain.title;
  document.getElementById('subdomain-desc').textContent = domain.description;

  const grid = document.getElementById('subdomain-grid');
  grid.innerHTML = domain.subDomains.map((sd, si) => `
    <div class="subdomain-card" onclick="openSubDomain(${idx}, ${si})">
      <div>
        <div class="sd-title">${sd.title}</div>
        <div class="sd-desc">${sd.description}</div>
      </div>
      <span class="sd-arrow">→</span>
    </div>
  `).join('');
}

function openSubDomain(dIdx, sdIdx) {
  const domain = DOMAIN_DATA[dIdx];
  const sd = domain.subDomains[sdIdx];
  showTab('domain-detail');

  document.getElementById('detail-breadcrumbs').innerHTML =
    `<a href="#" onclick="showTab('domains'); return false;">Home</a> &gt; <a href="#" onclick="openDomain(${dIdx}); return false;">${domain.title}</a> &gt; ${sd.title}`;

  const content = document.getElementById('detail-content');
  content.innerHTML = `
    <div class="detail-section">
      <h2>📖 Introduction</h2>
      <p>${sd.intro}</p>
      <p style="margin-top:10px;"><strong>Why it matters:</strong> ${sd.importance}</p>
    </div>
    <div class="detail-section">
      <h2>🛠️ Skills Covered</h2>
      <div class="badge-wrap">${sd.skills.map(s => `<span class="badge">${s}</span>`).join('')}</div>
    </div>
    <div class="detail-section">
      <h2>🗺️ Learning Path</h2>
      <div class="path-timeline">
        ${sd.path.map(p => `<div class="path-step"><div class="step-level">${p.level}</div><div class="step-text">${p.steps}</div></div>`).join('')}
      </div>
    </div>
    <div class="detail-section">
      <h2>🚀 How to Start</h2>
      <p>${sd.howToLearn}</p>
    </div>
    <div class="detail-section">
      <h2>🆓 Free Resources</h2>
      <div class="resource-cards">
        ${sd.freePlatforms.map(p => `<div class="resource-card"><a href="#" onclick="return false;">📚 ${p}</a></div>`).join('')}
      </div>
    </div>
    <div class="detail-section">
      <h2>💼 Career Opportunities</h2>
      <div class="career-list">${sd.careers.map(c => `<div class="career-item">${c}</div>`).join('')}</div>
    </div>
    <div class="detail-section">
      <h2>🔧 Tools & Technologies</h2>
      <div class="tool-grid">${sd.tools.map(t => `<div class="tool-item">${t}</div>`).join('')}</div>
    </div>
  `;
}

// ─── RESTART ───
function logout() {
  localStorage.removeItem('ls_user');
  currentUser = { name: 'Learner', onboardingComplete: false, progress: {}, completedTopics: [] };
  learningPath = null;
  // Reset onboarding form
  document.getElementById('ob-domain').value = '';
  document.getElementById('ob-goal').value = '';
  document.getElementById('ob-cert').value = '';
  setOnboardStep(1);
  showPage('onboarding');
  showToast('👋 Restarted learning journey.', 'success');
}

// ─── HELPERS ───
function showError(el, msg) {
  el.textContent = msg;
  el.classList.remove('hidden');
}
function hideError(el) {
  el.textContent = '';
  el.classList.add('hidden');
}

// Close modal on backdrop click
document.addEventListener('click', (e) => {
  if (e.target.id === 'phase-modal') closePhaseModal();
});

// ═══════════════════════════════════════════════════════════════
//   SHARED CHAT ENGINE — LSphere AI + LS Mini (Unified System)
// ═══════════════════════════════════════════════════════════════

let chatThreads = [];       // Array of { id, title, messages: [{role,content,time}] }
let activeThreadId = null;
let isAILoading = false;

// ─── PERSISTENCE ───
function loadChatThreads() {
  const saved = localStorage.getItem('ls_chat_threads');
  if (saved) chatThreads = JSON.parse(saved);
  if (!chatThreads.length) newConversation();
  else activeThreadId = chatThreads[0].id;
}
function saveChatThreads() {
  localStorage.setItem('ls_chat_threads', JSON.stringify(chatThreads));
}

function getActiveThread() {
  return chatThreads.find(t => t.id === activeThreadId);
}

// ─── THREAD MANAGEMENT ───
function newConversation() {
  const thread = {
    id: 'thread_' + Date.now(),
    title: 'New Chat',
    messages: []
  };
  chatThreads.unshift(thread);
  activeThreadId = thread.id;
  saveChatThreads();
  renderThreadList();
  renderChatMessages();
  renderMiniChat();
}

function switchThread(id) {
  activeThreadId = id;
  renderThreadList();
  renderChatMessages();
  renderMiniChat();
}

function deleteThread(id, e) {
  if (e) e.stopPropagation();
  chatThreads = chatThreads.filter(t => t.id !== id);
  if (activeThreadId === id) {
    if (chatThreads.length === 0) newConversation();
    else activeThreadId = chatThreads[0].id;
  }
  saveChatThreads();
  renderThreadList();
  renderChatMessages();
  renderMiniChat();
}

// ─── RENDER SIDEBAR THREADS ───
function renderThreadList() {
  const container = document.getElementById('ls-thread-list');
  if (!container) return;
  container.innerHTML = chatThreads.map(t => `
    <div class="ls-thread-item ${t.id === activeThreadId ? 'active' : ''}" onclick="switchThread('${t.id}')">
      <span class="ls-thread-icon">💬</span>
      <span class="ls-thread-text">${escHtml(t.title)}</span>
      <button class="ls-thread-delete" onclick="deleteThread('${t.id}', event)" title="Delete">🗑</button>
    </div>
  `).join('');
}

// ─── RENDER LSPHERE AI MESSAGES ───
function renderChatMessages() {
  const container = document.getElementById('ls-messages');
  if (!container) return;
  const thread = getActiveThread();
  if (!thread || thread.messages.length === 0) {
    container.innerHTML = `
      <div class="ls-welcome">
        <div class="ls-welcome-icon">🧠</div>
        <h2>Welcome to LSphere AI</h2>
        <p>Ask me anything about your certifications, career path, or learning goals. I can also navigate you to the right domain automatically!</p>
        <div class="ls-suggestions">
          <button class="ls-suggest-btn" onclick="sendLSphereMessage('Teach me Cloud Computing')">☁️ Teach me Cloud Computing</button>
          <button class="ls-suggest-btn" onclick="sendLSphereMessage('How to prepare for AWS Solutions Architect?')">📜 AWS Exam Prep</button>
          <button class="ls-suggest-btn" onclick="sendLSphereMessage('Explain cybersecurity basics')">🔒 Cybersecurity Basics</button>
          <button class="ls-suggest-btn" onclick="sendLSphereMessage('What skills do I need for data science?')">📊 Data Science Skills</button>
        </div>
      </div>
    `;
    return;
  }
  container.innerHTML = thread.messages.map(m => `
    <div class="ls-msg ${m.role}">
      <div class="ls-msg-bubble">${m.content}</div>
      <div class="ls-msg-time">${m.time || ''}</div>
    </div>
  `).join('');
  container.scrollTop = container.scrollHeight;
}

// ─── RENDER LS MINI MESSAGES ───
function renderMiniChat() {
  const body = document.getElementById('mini-chat-body');
  if (!body) return;
  const thread = getActiveThread();
  if (!thread || thread.messages.length === 0) {
    body.innerHTML = `<div class="chat-message ai"><div class="msg-content">👋 Hi! I'm LS Mini. Ask me anything or open LSphere AI for the full experience!</div></div>`;
    return;
  }
  // Show last 20 messages
  const msgs = thread.messages.slice(-20);
  body.innerHTML = msgs.map(m => `
    <div class="chat-message ${m.role}">
      <div class="msg-content">${m.content}</div>
    </div>
  `).join('');
  body.scrollTop = body.scrollHeight;
}

// ─── TOGGLE LS MINI ───
function toggleMiniChat() {
  const win = document.getElementById('chat-window');
  win.classList.toggle('hidden');
  if (!win.classList.contains('hidden')) {
    renderMiniChat();
    document.getElementById('mini-chat-input').focus();
  }
}

// ─── SEND MESSAGE (Shared Core) ───
async function sendSharedMessage(text, source) {
  if (isAILoading) return;
  const msg = (text || '').trim();
  if (!msg) return;

  const thread = getActiveThread();
  if (!thread) return;

  const now = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});

  // Add user message
  thread.messages.push({ role: 'user', content: escHtml(msg), time: now });

  // Update title from first message
  if (thread.messages.filter(m => m.role === 'user').length === 1) {
    thread.title = msg.length > 35 ? msg.substring(0, 35) + '...' : msg;
  }

  saveChatThreads();
  renderChatMessages();
  renderMiniChat();
  renderThreadList();

  // Clear inputs
  const lsInput = document.getElementById('ls-input');
  const miniInput = document.getElementById('mini-chat-input');
  if (lsInput) lsInput.value = '';
  if (miniInput) miniInput.value = '';

  // Show typing indicator
  isAILoading = true;
  showTypingIndicator(source);

  try {
    // Build messages array for backend
    const apiMessages = thread.messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content
    }));

    const context = currentUser?.certification || '';

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: apiMessages, context })
    });

    hideTypingIndicator(source);

    if (!res.ok) throw new Error(`Server error: ${res.status}`);

    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Unknown error');

    const reply = data.reply || "I couldn't generate a response.";
    const replyTime = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});

    thread.messages.push({ role: 'ai', content: reply, time: replyTime });
    saveChatThreads();
    renderChatMessages();
    renderMiniChat();

    // Smart Redirection
    if (data.redirectDomain) {
      handleSmartRedirect(data.redirectDomain, source);
    }

  } catch (err) {
    hideTypingIndicator(source);
    console.error('Chat Error:', err);
    const errorReply = '⚠️ Could not reach the AI server. Make sure `python app.py` is running.';
    thread.messages.push({ role: 'ai', content: errorReply, time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) });
    saveChatThreads();
    renderChatMessages();
    renderMiniChat();
  } finally {
    isAILoading = false;
  }
}

// ─── TYPING INDICATORS ───
function showTypingIndicator(source) {
  if (source === 'lsphere') {
    const container = document.getElementById('ls-messages');
    if (container) {
      container.insertAdjacentHTML('beforeend', `
        <div class="ls-typing" id="ls-typing-indicator">
          <div class="ls-typing-dot"></div><div class="ls-typing-dot"></div><div class="ls-typing-dot"></div>
        </div>
      `);
      container.scrollTop = container.scrollHeight;
    }
  }
  if (source === 'mini') {
    const body = document.getElementById('mini-chat-body');
    if (body) {
      body.insertAdjacentHTML('beforeend', `
        <div class="chat-typing" id="mini-typing-indicator">
          <div class="chat-dot"></div><div class="chat-dot"></div><div class="chat-dot"></div>
        </div>
      `);
      body.scrollTop = body.scrollHeight;
    }
  }
}
function hideTypingIndicator(source) {
  document.getElementById('ls-typing-indicator')?.remove();
  document.getElementById('mini-typing-indicator')?.remove();
}

// ─── SMART REDIRECTION ───
function handleSmartRedirect(domainName, source) {
  if (typeof DOMAIN_DATA === 'undefined') return;
  const idx = DOMAIN_DATA.findIndex(d =>
    d.title.toLowerCase().includes(domainName.toLowerCase()) ||
    domainName.toLowerCase().includes(d.title.toLowerCase())
  );
  if (idx === -1) return;

  // Add a redirect toast to LSphere AI messages area
  const container = document.getElementById('ls-messages');
  if (container) {
    container.insertAdjacentHTML('beforeend', `
      <div class="ls-redirect-toast" onclick="openDomain(${idx}); showTab('subdomains');">
        🧭 Navigate to <strong>${DOMAIN_DATA[idx].title}</strong> → Click here to open
      </div>
    `);
    container.scrollTop = container.scrollHeight;
  }

  // Auto-navigate after 2 seconds
  setTimeout(() => {
    openDomain(idx);
    showTab('subdomains');
  }, 2500);
}

// ─── PUBLIC WRAPPERS ───
function sendLSphereMessage(preset) {
  const inputEl = document.getElementById('ls-input');
  const text = preset || (inputEl ? inputEl.value : '');
  if (inputEl && preset) inputEl.value = preset;
  sendSharedMessage(text, 'lsphere');
}

function sendMiniMessage() {
  const inputEl = document.getElementById('mini-chat-input');
  const text = inputEl ? inputEl.value : '';
  sendSharedMessage(text, 'mini');
}

// ─── HELPER ───
function escHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
}
