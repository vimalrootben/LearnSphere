// ═══════════════════════════════════════════════
// LEARNSPHERE — app.js (Standalone Mock Mode)
// ═══════════════════════════════════════════════

// State
let state = {
  token: localStorage.getItem('ls_token') || null,
  user: JSON.parse(localStorage.getItem('ls_user')) || null,
  path: JSON.parse(localStorage.getItem('ls_path')) || null,
  skillGapSummary: localStorage.getItem('ls_summary') || '',
  testQuestions: [],
  currentQuestion: 0,
  score: 0,
  answers: []
};

// ─────────────────────────────────────────────
// Boot
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setupOTPBoxes();
  addRadialGradientDef();
  if (state.token && state.user) {
    if (!state.user.onboardingComplete) {
      showPage('onboarding');
    } else {
      showPage('app');
      loadDashboard();
    }
  } else {
    showPage('login');
  }
});

function saveState() {
  if (state.token) localStorage.setItem('ls_token', state.token);
  if (state.user) localStorage.setItem('ls_user', JSON.stringify(state.user));
  if (state.path) localStorage.setItem('ls_path', JSON.stringify(state.path));
  if (state.skillGapSummary) localStorage.setItem('ls_summary', state.skillGapSummary);
}

// ─────────────────────────────────────────────
// Page Routing
// ─────────────────────────────────────────────
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name)?.classList.add('active');
}

function showTab(name) {
  document.querySelectorAll('.tab-section').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('tab-' + name)?.classList.add('active');
  document.getElementById('nav-' + name)?.classList.add('active');
  if (name === 'roadmap') renderRoadmap();
  if (name === 'mocktest') resetTest();
}

// ─────────────────────────────────────────────
// AUTH — Login / OTP (MOCKED)
// ─────────────────────────────────────────────
async function sendOTP() {
  const email = document.getElementById('login-email').value.trim();
  const errEl = document.getElementById('login-error');
  errEl.classList.add('hidden');

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    showError(errEl, 'Please enter a valid email address.'); return;
  }

  const btn = document.getElementById('btn-send-otp');
  btn.disabled = true; btn.textContent = 'Sending…';

  // Simulate network
  setTimeout(() => {
    // Auto-fill OTP for demo purposes
    ['o1','o2','o3','o4','o5','o6'].forEach(id => document.getElementById(id).value = '1');
    
    document.getElementById('otp-email-label').textContent = email;
    document.getElementById('step-email').classList.add('hidden');
    document.getElementById('step-otp').classList.remove('hidden');
    document.getElementById('o6').focus();
    btn.disabled = false; btn.innerHTML = '<span>Send OTP</span><span class="btn-icon">→</span>';
  }, 800);
}

async function verifyOTP() {
  const email = document.getElementById('login-email').value.trim();
  const otp = ['o1','o2','o3','o4','o5','o6'].map(id => document.getElementById(id).value).join('');
  const errEl = document.getElementById('otp-error');
  errEl.classList.add('hidden');

  if (otp.length !== 6) { showError(errEl, 'Please enter all 6 digits.'); return; }

  // Simulate login
  state.token = 'mock_token_' + Date.now();
  state.user = { email, name: '', onboardingComplete: false, readinessScore: 0 };
  saveState();

  showPage('onboarding');
}

function showEmailStep() {
  document.getElementById('step-email').classList.remove('hidden');
  document.getElementById('step-otp').classList.add('hidden');
  ['o1','o2','o3','o4','o5','o6'].forEach(id => document.getElementById(id).value = '');
}

function setupOTPBoxes() {
  const ids = ['o1','o2','o3','o4','o5','o6'];
  ids.forEach((id, i) => {
    const el = document.getElementById(id);
    el.addEventListener('input', () => {
      el.value = el.value.replace(/\D/,'');
      if (el.value && i < ids.length - 1) document.getElementById(ids[i+1]).focus();
    });
    el.addEventListener('keydown', e => {
      if (e.key === 'Backspace' && !el.value && i > 0) document.getElementById(ids[i-1]).focus();
    });
    el.addEventListener('paste', e => {
      const paste = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g,'');
      if (paste.length === 6) {
        ids.forEach((id,j) => { document.getElementById(id).value = paste[j] || ''; });
        document.getElementById(ids[5]).focus();
      }
      e.preventDefault();
    });
  });
}

function logout() {
  localStorage.clear();
  state = { token: null, user: null, path: null, skillGapSummary: '', testQuestions: [], currentQuestion: 0, score: 0, answers: [] };
  showPage('login');
  showEmailStep();
}

// ─────────────────────────────────────────────
// ONBOARDING (MOCKED)
// ─────────────────────────────────────────────
function obNext(step) {
  if (step === 1) {
    const name = document.getElementById('ob-name').value.trim();
    const skills = document.getElementById('ob-skills').value.trim();
    if (!name || !skills) { alert('Please fill in your name and skills.'); return; }
    setStep(1, 2);
  } else if (step === 2) {
    setStep(2, 3);
  }
}
function obBack(step) {
  if (step === 2) setStep(2, 1);
  if (step === 3) setStep(3, 2);
}
function setStep(from, to) {
  document.getElementById('ob-step' + from).classList.add('hidden');
  document.getElementById('ob-step' + to).classList.remove('hidden');
  document.getElementById('sdot' + from).classList.remove('active');
  document.getElementById('sdot' + from).classList.add('done');
  document.getElementById('sdot' + to).classList.add('active');
}

async function submitOnboarding() {
  const name = document.getElementById('ob-name').value.trim();
  const skills = document.getElementById('ob-skills').value.trim().split(',').map(s => s.trim()).filter(Boolean);
  const goal = document.getElementById('ob-goal-custom').value.trim() || document.getElementById('ob-goal').value;
  const cert = document.getElementById('ob-cert').value;
  const level = document.getElementById('ob-level').value;

  const btn = document.getElementById('btn-ob-finish');
  btn.disabled = true; btn.textContent = '⏳ Analyzing Profile…';

  setTimeout(() => {
    state.user.name = name;
    state.user.currentSkills = skills;
    state.user.learningGoal = goal;
    state.user.targetCertification = cert;
    state.user.experienceLevel = level;
    state.user.onboardingComplete = true;
    saveState();

    showPage('app');
    updateSidebarUser();
    generatePath();
  }, 1000);
}

// ─────────────────────────────────────────────
// APP — Dashboard (MOCKED)
// ─────────────────────────────────────────────
function loadDashboard() {
  updateSidebarUser();
  if (state.path) {
    updateDashboardUI();
    hideEmptyState();
  } else {
    showEmptyState();
  }
}

function generatePath() {
  showSection('loading-path');
  hideSection('no-path-msg');
  
  setTimeout(() => {
    // Generate mock AI response
    state.skillGapSummary = `Based on your goal to become a ${state.user.learningGoal}, you have a good start with ${state.user.currentSkills.join(', ')}. However, you are missing core advanced concepts required for the ${state.user.targetCertification}. You need to strengthen your architectural understanding and hands-on deployment skills.`;
    
    state.path = {
      goal: state.user.learningGoal,
      certification: state.user.targetCertification,
      readinessScore: 35,
      totalTopics: 6,
      completedCount: 0,
      phases: [
        {
          phaseName: 'Phase 1: Core Fundamentals',
          duration: '1 Week',
          topics: [
            { title: 'Advanced Architecture Patterns', description: 'Understand deep architectural patterns required for the certification.', completed: false, resources: [{ label: 'View Documentation', url: '#' }] },
            { title: 'Security & Best Practices', description: 'Implement standard security measures and IAM policies.', completed: false, resources: [{ label: 'Security Guide', url: '#' }] }
          ]
        },
        {
          phaseName: 'Phase 2: Specialized Skills',
          duration: '2 Weeks',
          topics: [
            { title: 'Database Optimization', description: 'Learn how to optimize queries and structure NoSQL/SQL databases.', completed: false, resources: [{ label: 'Optimization Tutorial', url: '#' }] },
            { title: 'API Gateway & Routing', description: 'Design scalable and rate-limited API gateways.', completed: false, resources: [] }
          ]
        },
        {
          phaseName: 'Phase 3: Deployment & Review',
          duration: '1 Week',
          topics: [
            { title: 'CI/CD Pipelines', description: 'Automate your deployments using GitHub Actions or Jenkins.', completed: false, resources: [{ label: 'CI/CD Guide', url: '#' }] },
            { title: 'Practice Exams', description: 'Take 2-3 full practice exams to ensure readiness.', completed: false, resources: [{ label: 'Mock Exams', url: '#' }] }
          ]
        }
      ]
    };
    saveState();
    updateDashboardUI();
    hideEmptyState();
    hideSection('loading-path');
  }, 2500);
}

function regeneratePath() {
  if (confirm('Regenerate your learning path? Your current progress will be reset.')) {
    state.path = null;
    saveState();
    generatePath();
  }
}

function updateDashboardUI() {
  const p = state.path;
  if (!p) return;

  setReadiness(p.readinessScore);
  document.getElementById('stat-cert').textContent = p.certification || '–';

  const pct = p.totalTopics > 0 ? Math.round((p.completedCount / p.totalTopics) * 100) : 0;
  document.getElementById('overall-bar').style.width = pct + '%';
  document.getElementById('overall-pct-label').textContent = `${p.completedCount} / ${p.totalTopics} topics`;
  document.getElementById('stat-completed').textContent = p.completedCount;
  document.getElementById('stat-remaining').textContent = p.totalTopics - p.completedCount;
  document.getElementById('stat-phases').textContent = p.phases?.length || 0;

  if (state.skillGapSummary) {
    document.getElementById('skill-gap-summary').textContent = state.skillGapSummary;
  }

  const tagsEl = document.getElementById('skills-tags');
  tagsEl.innerHTML = '';
  if (state.user?.currentSkills?.length) {
    state.user.currentSkills.forEach(s => {
      const tag = document.createElement('span');
      tag.className = 'skill-tag'; tag.textContent = s;
      tagsEl.appendChild(tag);
    });
  }
}

function setReadiness(pct) {
  const circle = document.getElementById('radial-fill');
  const circumference = 314;
  const offset = circumference - (pct / 100) * circumference;
  circle.style.strokeDashoffset = offset;
  circle.style.stroke = `url(#radialGrad)`;
  document.getElementById('readiness-pct').textContent = pct + '%';
}

function addRadialGradientDef() {
  const svg = document.querySelector('.radial-chart');
  if (!svg) return;
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  defs.innerHTML = `
    <linearGradient id="radialGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>`;
  svg.prepend(defs);
}

function updateSidebarUser() {
  if (!state.user) return;
  const name = state.user.name || state.user.email.split('@')[0];
  document.getElementById('sidebar-name').textContent = name;
  document.getElementById('sidebar-email').textContent = state.user.email;
  document.getElementById('sidebar-avatar').textContent = name.charAt(0).toUpperCase();
}

function showEmptyState() { showSection('no-path-msg'); }
function hideEmptyState() { hideSection('no-path-msg'); }
function showSection(id) { document.getElementById(id)?.classList.remove('hidden'); }
function hideSection(id) { document.getElementById(id)?.classList.add('hidden'); }

// ─────────────────────────────────────────────
// ROADMAP (MOCKED)
// ─────────────────────────────────────────────
function renderRoadmap() {
  const container = document.getElementById('roadmap-container');
  const empty = document.getElementById('roadmap-empty');
  if (!state.path) { container.innerHTML = ''; empty.classList.remove('hidden'); return; }
  empty.classList.add('hidden');

  document.getElementById('roadmap-goal-label').textContent =
    `Goal: ${state.path.goal || '–'} · ${state.path.certification || '–'}`;

  container.innerHTML = state.path.phases.map((phase, pi) => `
    <div class="phase-block">
      <div class="phase-dot">${pi + 1}</div>
      <div class="phase-header">
        <div class="phase-name">${escHtml(phase.phaseName)}</div>
        <div class="phase-duration">⏱ ${escHtml(phase.duration || '')}</div>
      </div>
      <div class="topic-list">
        ${phase.topics.map((topic, ti) => `
          <div class="topic-card ${topic.completed ? 'completed' : ''}" id="tc-${pi}-${ti}">
            <div class="topic-header">
              <div>
                <div class="topic-title">${topic.completed ? '✅ ' : ''}${escHtml(topic.title)}</div>
                <div class="topic-desc">${escHtml(topic.description || '')}</div>
              </div>
              ${!topic.completed ? `
                <button class="btn-complete" onclick="markComplete(${pi},${ti})">Mark Done</button>
              ` : `<span class="btn-complete done">✓ Done</span>`}
            </div>
            ${topic.resources?.length ? `
              <div class="topic-resources">
                ${topic.resources.map(r => `<a class="res-link" href="${escHtml(r.url)}" target="_blank" rel="noopener">📎 ${escHtml(r.label)}</a>`).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function markComplete(phaseIndex, topicIndex) {
  const p = state.path;
  p.phases[phaseIndex].topics[topicIndex].completed = true;
  
  let completedCount = 0;
  p.phases.forEach(phase => phase.topics.forEach(t => { if (t.completed) completedCount++; }));
  p.completedCount = completedCount;

  const newReadiness = Math.min(100, Math.round((completedCount / p.totalTopics) * 100));
  const initialScore = p.readinessScore;
  p.readinessScore = Math.max(initialScore, newReadiness + initialScore * (1 - newReadiness / 100));
  p.readinessScore = Math.min(100, Math.round(p.readinessScore));
  
  saveState();
  renderRoadmap();
  updateDashboardUI();
}

// ─────────────────────────────────────────────
// MOCK TEST (MOCKED)
// ─────────────────────────────────────────────
function startMockTest() {
  if (!state.path) { alert('Generate a learning path first!'); return; }
  document.getElementById('test-start').classList.add('hidden');
  document.getElementById('test-loading').classList.remove('hidden');

  setTimeout(() => {
    state.testQuestions = [
      {
        question: `Which of the following describes the key benefit of leveraging a CI/CD pipeline for your ${state.user.learningGoal} projects?`,
        options: ["It reduces the need for manual code review.", "It automates the testing and deployment workflow.", "It replaces the need for local debugging.", "It prevents all runtime exceptions."],
        answer: "B",
        explanation: "CI/CD automates the processes of testing and deploying, allowing teams to deliver code changes more frequently and reliably."
      },
      {
        question: "For a highly available architecture, how should resources be distributed?",
        options: ["In a single availability zone.", "Across multiple availability zones.", "Only on local physical servers.", "In a single highly resilient server."],
        answer: "B",
        explanation: "Distributing resources across multiple Availability Zones protects against the failure of a single location."
      },
      {
        question: "When prioritizing security, which principle ensures users have only the permissions they need?",
        options: ["Principle of Maximum Privilege", "Role-Based Overload", "Principle of Least Privilege", "Symmetric Encryption"],
        answer: "C",
        explanation: "The Principle of Least Privilege dictates that users and applications should only be given the permissions strictly required to perform their tasks."
      },
      {
        question: `Which specific service is most relevant if you need to optimize database reads for your ${state.user.targetCertification}?`,
        options: ["A caching layer (e.g., Redis or Memcached)", "A larger hard drive", "A content delivery network (CDN)", "Long-term cold storage"],
        answer: "A",
        explanation: "Caching layers temporarily store frequently accessed data in memory, significantly speeding up database read operations."
      },
      {
        question: "In standard API design, what HTTP method is conventionally used to update an existing resource fully?",
        options: ["GET", "POST", "PUT", "DELETE"],
        answer: "C",
        explanation: "PUT is standardly used for updating a resource entirely, whereas PATCH is used for partial updates."
      }
    ];
    state.currentQuestion = 0;
    state.score = 0;
    state.answers = [];
    document.getElementById('test-loading').classList.add('hidden');
    document.getElementById('test-area').classList.remove('hidden');
    renderQuestion();
  }, 1500);
}

function renderQuestion() {
  const q = state.testQuestions[state.currentQuestion];
  if (!q) return;

  const total = state.testQuestions.length;
  const pct = (state.currentQuestion / total) * 100;
  document.getElementById('test-prog-fill').style.width = pct + '%';

  document.getElementById('question-container').innerHTML = `
    <div class="question-card">
      <div class="q-number">Question ${state.currentQuestion + 1} of ${total}</div>
      <div class="q-text">${escHtml(q.question)}</div>
      <div class="options-list">
        ${q.options.map((opt, i) => `
          <button class="option-btn" id="opt-${i}" onclick="selectAnswer(${i}, '${escHtml(q.answer)}', ${JSON.stringify(q.explanation).replace(/"/g,'&quot;')})">
            ${escHtml(opt)}
          </button>
        `).join('')}
      </div>
      <div id="explanation-box" class="hidden"></div>
    </div>
  `;
  document.getElementById('btn-next-q').style.display = 'none';
}

function selectAnswer(selectedIdx, correctLetter, explanation) {
  const q = state.testQuestions[state.currentQuestion];
  const correctIdx = ['A','B','C','D'].indexOf(correctLetter.toUpperCase());
  const isCorrect = selectedIdx === correctIdx;

  if (isCorrect) state.score++;
  state.answers.push({ question: q.question, selected: selectedIdx, correct: correctIdx, isCorrect });

  document.querySelectorAll('.option-btn').forEach((btn, i) => {
    btn.disabled = true;
    if (i === correctIdx) btn.classList.add('correct');
    else if (i === selectedIdx && !isCorrect) btn.classList.add('wrong');
  });

  const expBox = document.getElementById('explanation-box');
  expBox.classList.remove('hidden');
  expBox.innerHTML = `<div class="explanation">💡 ${escHtml(explanation || 'No explanation provided.')}</div>`;

  const nextBtn = document.getElementById('btn-next-q');
  nextBtn.style.display = 'flex';
  nextBtn.textContent = state.currentQuestion < state.testQuestions.length - 1
    ? 'Next Question →' : '🏁 See Results';
}

function nextQuestion() {
  state.currentQuestion++;
  if (state.currentQuestion < state.testQuestions.length) {
    renderQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  document.getElementById('test-area').classList.add('hidden');
  document.getElementById('test-results').classList.remove('hidden');

  const total = state.testQuestions.length;
  const pct = Math.round((state.score / total) * 100);
  const icon = pct >= 80 ? '🏆' : pct >= 60 ? '🎉' : pct >= 40 ? '💪' : '📚';

  document.getElementById('result-icon').textContent = icon;
  document.getElementById('result-title').textContent = pct >= 80 ? 'Excellent Work!' : pct >= 60 ? 'Good Job!' : 'Keep Practicing!';
  document.getElementById('result-score-label').textContent = `${state.score} / ${total} (${pct}%)`;
  document.getElementById('test-prog-fill').style.width = '100%';

  const reviewEl = document.getElementById('result-review');
  reviewEl.innerHTML = state.answers.map((a, i) => `
    <div class="review-item ${a.isCorrect ? 'correct-r' : 'wrong-r'}">
      <span>${a.isCorrect ? '✅' : '❌'}</span>
      <span>Q${i+1}: ${escHtml(state.testQuestions[i]?.question || '')}</span>
    </div>
  `).join('');
}

function resetTest() {
  document.getElementById('test-results').classList.add('hidden');
  document.getElementById('test-area').classList.add('hidden');
  document.getElementById('test-start').classList.remove('hidden');
  state.testQuestions = []; state.currentQuestion = 0; state.score = 0; state.answers = [];
  document.getElementById('test-prog-fill').style.width = '0%';
}

function showError(el, msg) { el.textContent = msg; el.classList.remove('hidden'); }
function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
