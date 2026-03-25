// ═══════════════════════════════════════════════
// LEARNSPHERE — app.js (Full Auth + Dashboard)
// ═══════════════════════════════════════════════

// ── CONFIG ──
const RESEND_API_KEY = 're_JVdRXyad_JD1oEKmEUFActBPeH2Ye3XLJ';
const ADMIN_EMAILS = ['admin@learnsphere.com'];

// ── STATE ──
let state = {
  token: localStorage.getItem('ls_token') || null,
  user: JSON.parse(localStorage.getItem('ls_user')) || null,
  path: JSON.parse(localStorage.getItem('ls_path')) || null,
  skillGapSummary: localStorage.getItem('ls_summary') || '',
  registeredUsers: JSON.parse(localStorage.getItem('ls_users')) || {},
  pendingOTP: null,
  testQuestions: [],
  currentQuestion: 0,
  score: 0,
  answers: []
};

// ─────────────────────────────────────────────
// BOOT
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setupAllOTPBoxes();
  setupPasswordStrength();
  protectRoutes();

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
  localStorage.setItem('ls_users', JSON.stringify(state.registeredUsers));
}

// ─────────────────────────────────────────────
// ROUTE PROTECTION & RBAC
// ─────────────────────────────────────────────
function protectRoutes() {
  // Block admin URL access
  const blockedPaths = ['/admin', '/administrator', '/admin-panel', '/manage'];
  const currentPath = window.location.pathname.toLowerCase();
  if (blockedPaths.some(p => currentPath.includes(p))) {
    window.location.href = '/';
    return;
  }

  // Listen for hash changes
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.toLowerCase();
    if (hash.includes('admin')) {
      window.location.hash = '';
      if (!isAdmin()) {
        showPage('login');
        return;
      }
    }
  });
}

function isAdmin() {
  return state.user && ADMIN_EMAILS.includes(state.user.email?.toLowerCase());
}

function requireAuth() {
  if (!state.token || !state.user) {
    showPage('login');
    return false;
  }
  return true;
}

// ─────────────────────────────────────────────
// PAGE ROUTING
// ─────────────────────────────────────────────
function showPage(name) {
  // Auth guard — only login/signup accessible without auth
  const publicPages = ['login', 'signup'];
  if (!publicPages.includes(name) && !state.token) {
    name = 'login';
  }

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('page-' + name);
  if (page) {
    page.classList.add('active');
    // Reset page scroll
    page.style.display = '';
  }
}

function showTab(name) {
  if (!requireAuth()) return;

  document.querySelectorAll('.tab-section').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.header-nav-btn').forEach(n => n.classList.remove('active'));
  document.getElementById('tab-' + name)?.classList.add('active');
  document.getElementById('hnav-' + name)?.classList.add('active');
  if (name === 'roadmap') renderRoadmap();
  if (name === 'mocktest') resetTest();
}

// ─────────────────────────────────────────────
// OTP GENERATION (using Resend API)
// ─────────────────────────────────────────────
function generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function sendOTPEmail(email, otp) {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'LearnSphere <onboarding@resend.dev>',
        to: [email],
        subject: 'Your LearnSphere Verification Code',
        html: `
          <div style="font-family: 'Inter', sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #0056d2; font-size: 22px; margin: 0;">🎓 LEARNSPHERE</h1>
              <p style="color: #6b7280; font-size: 14px; margin-top: 4px;">Smart Personalized Learning</p>
            </div>
            <div style="background: #f5f7fa; border-radius: 12px; padding: 32px; text-align: center;">
              <p style="color: #4b5563; margin-bottom: 16px;">Your verification code is:</p>
              <div style="font-size: 36px; font-weight: 800; color: #0056d2; letter-spacing: 8px; margin-bottom: 16px;">${otp}</div>
              <p style="color: #9ca3af; font-size: 12px;">This code expires in 10 minutes.</p>
            </div>
            <p style="color: #9ca3af; font-size: 11px; text-align: center; margin-top: 24px;">If you didn't request this code, you can safely ignore this email.</p>
          </div>
        `
      }),
    });
    return response.ok;
  } catch (err) {
    console.warn('Email API failed, using local OTP:', err);
    return false;
  }
}

// ─────────────────────────────────────────────
// LOGIN FLOW: Email → Password → OTP
// ─────────────────────────────────────────────
async function loginEmailStep() {
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const errEl = document.getElementById('login-email-error');
  errEl.classList.add('hidden');

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    showError(errEl, 'Please enter a valid email address.');
    return;
  }

  // Check if user exists
  if (!state.registeredUsers[email]) {
    showError(errEl, 'No account found with this email. Please sign up first.');
    return;
  }

  document.getElementById('login-email-display').textContent = email;
  document.getElementById('login-step-email').classList.add('hidden');
  document.getElementById('login-step-password').classList.remove('hidden');
  document.getElementById('login-password').focus();
}

async function loginPasswordStep() {
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;
  const errEl = document.getElementById('login-pw-error');
  errEl.classList.add('hidden');

  if (!password) {
    showError(errEl, 'Please enter your password.');
    return;
  }

  const user = state.registeredUsers[email];
  if (!user || user.password !== hashPassword(password)) {
    showError(errEl, 'Incorrect password. Please try again.');
    return;
  }

  // Generate and send OTP
  const otp = generateOTP();
  state.pendingOTP = { email, otp, expiresAt: Date.now() + 600000 };

  const btn = document.querySelector('#login-step-password .btn-primary');
  btn.disabled = true;
  btn.textContent = 'Sending OTP…';

  const emailSent = await sendOTPEmail(email, otp);

  if (!emailSent) {
    // Fallback: auto-fill for demo
    console.log('📧 OTP for demo:', otp);
    const otpBoxes = document.querySelectorAll('#login-step-otp .otp-box');
    otp.split('').forEach((d, i) => { if (otpBoxes[i]) otpBoxes[i].value = d; });
  }

  document.getElementById('login-otp-email').textContent = email;
  document.getElementById('login-step-password').classList.add('hidden');
  document.getElementById('login-step-otp').classList.remove('hidden');
  btn.disabled = false;
  btn.innerHTML = 'Verify & Send OTP <span class="btn-arrow">→</span>';
}

async function loginVerifyOTP() {
  const otpBoxes = document.querySelectorAll('#login-step-otp .otp-box');
  const otp = Array.from(otpBoxes).map(b => b.value).join('');
  const errEl = document.getElementById('login-otp-error');
  errEl.classList.add('hidden');

  if (otp.length !== 6) {
    showError(errEl, 'Please enter all 6 digits.');
    return;
  }

  if (!state.pendingOTP || state.pendingOTP.otp !== otp) {
    showError(errEl, 'Invalid OTP. Please try again.');
    return;
  }

  if (Date.now() > state.pendingOTP.expiresAt) {
    showError(errEl, 'OTP has expired. Please request a new one.');
    return;
  }

  // Success — login
  const email = state.pendingOTP.email;
  const userData = state.registeredUsers[email];
  state.token = 'jwt_' + btoa(email + ':' + Date.now());
  state.user = {
    email,
    name: userData.name,
    role: ADMIN_EMAILS.includes(email) ? 'admin' : 'user',
    onboardingComplete: userData.onboardingComplete || false,
    currentSkills: userData.currentSkills || [],
    learningGoal: userData.learningGoal || '',
    targetCertification: userData.targetCertification || '',
    experienceLevel: userData.experienceLevel || ''
  };
  state.pendingOTP = null;

  // Restore saved path if exists
  const savedPath = localStorage.getItem('ls_path_' + email);
  if (savedPath) {
    state.path = JSON.parse(savedPath);
    state.skillGapSummary = localStorage.getItem('ls_summary_' + email) || '';
  }

  saveState();

  if (!state.user.onboardingComplete) {
    showPage('onboarding');
  } else {
    showPage('app');
    loadDashboard();
  }
}

function loginGoBack() {
  document.getElementById('login-step-password').classList.add('hidden');
  document.getElementById('login-step-otp').classList.add('hidden');
  document.getElementById('login-step-email').classList.remove('hidden');
  document.getElementById('login-password').value = '';
  clearOTPBoxes('#login-step-otp .otp-box');
}

// ─────────────────────────────────────────────
// SIGNUP FLOW: Form → OTP → Success
// ─────────────────────────────────────────────
async function signupSubmit() {
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim().toLowerCase();
  const password = document.getElementById('signup-password').value;
  const confirm = document.getElementById('signup-confirm').value;
  const errEl = document.getElementById('signup-error');
  errEl.classList.add('hidden');

  // Validations
  if (!name) { showError(errEl, 'Please enter your full name.'); return; }
  if (!email || !/\S+@\S+\.\S+/.test(email)) { showError(errEl, 'Please enter a valid email address.'); return; }
  if (password.length < 8) { showError(errEl, 'Password must be at least 8 characters.'); return; }
  if (password !== confirm) { showError(errEl, 'Passwords do not match.'); return; }
  if (state.registeredUsers[email]) { showError(errEl, 'An account with this email already exists. Please log in.'); return; }

  // Generate and send OTP
  const otp = generateOTP();
  state.pendingOTP = { email, otp, name, password: hashPassword(password), expiresAt: Date.now() + 600000 };

  const btn = document.querySelector('#signup-step-form .btn-primary');
  btn.disabled = true;
  btn.textContent = 'Sending OTP…';

  const emailSent = await sendOTPEmail(email, otp);

  if (!emailSent) {
    console.log('📧 Signup OTP for demo:', otp);
    const otpBoxes = document.querySelectorAll('#signup-step-otp .otp-box');
    otp.split('').forEach((d, i) => { if (otpBoxes[i]) otpBoxes[i].value = d; });
  }

  document.getElementById('signup-otp-email').textContent = email;
  document.getElementById('signup-step-form').classList.add('hidden');
  document.getElementById('signup-step-otp').classList.remove('hidden');
  btn.disabled = false;
  btn.innerHTML = 'Create Account <span class="btn-arrow">→</span>';
}

async function signupVerifyOTP() {
  const otpBoxes = document.querySelectorAll('#signup-step-otp .otp-box');
  const otp = Array.from(otpBoxes).map(b => b.value).join('');
  const errEl = document.getElementById('signup-otp-error');
  errEl.classList.add('hidden');

  if (otp.length !== 6) { showError(errEl, 'Please enter all 6 digits.'); return; }
  if (!state.pendingOTP || state.pendingOTP.otp !== otp) { showError(errEl, 'Invalid OTP. Please try again.'); return; }
  if (Date.now() > state.pendingOTP.expiresAt) { showError(errEl, 'OTP has expired. Please try again.'); return; }

  // Register the user
  const { email, name, password } = state.pendingOTP;
  state.registeredUsers[email] = {
    name,
    password,
    email,
    role: ADMIN_EMAILS.includes(email) ? 'admin' : 'user',
    createdAt: new Date().toISOString(),
    onboardingComplete: false
  };
  state.pendingOTP = null;
  saveState();

  // Send confirmation email
  await sendOTPEmail(email, '').catch(() => {});

  // Show success
  document.getElementById('signup-step-otp').classList.add('hidden');
  document.getElementById('signup-step-success').classList.remove('hidden');

  // Redirect to login after 3 seconds
  setTimeout(() => {
    document.getElementById('signup-step-success').classList.add('hidden');
    document.getElementById('signup-step-form').classList.remove('hidden');
    // Reset form
    document.getElementById('signup-name').value = '';
    document.getElementById('signup-email').value = '';
    document.getElementById('signup-password').value = '';
    document.getElementById('signup-confirm').value = '';
    clearOTPBoxes('#signup-step-otp .otp-box');
    showPage('login');
  }, 3000);
}

// ─────────────────────────────────────────────
// PASSWORD UTILITIES
// ─────────────────────────────────────────────
function hashPassword(pw) {
  // Simple hash for client-side demo — in production, use bcrypt on the server
  let hash = 0;
  for (let i = 0; i < pw.length; i++) {
    const char = pw.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return 'hash_' + Math.abs(hash).toString(36);
}

function togglePw(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈';
  } else {
    input.type = 'password';
    btn.textContent = '👁️';
  }
}

function setupPasswordStrength() {
  const pwInput = document.getElementById('signup-password');
  if (!pwInput) return;
  pwInput.addEventListener('input', () => {
    const pw = pwInput.value;
    const strengthEl = document.getElementById('pw-strength');
    const fillEl = document.getElementById('pw-bar-fill');
    const labelEl = document.getElementById('pw-strength-label');

    if (pw.length === 0) { strengthEl.classList.add('hidden'); return; }
    strengthEl.classList.remove('hidden');

    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    const levels = [
      { width: '20%', color: '#dc2626', label: 'Very Weak' },
      { width: '40%', color: '#f97316', label: 'Weak' },
      { width: '60%', color: '#eab308', label: 'Fair' },
      { width: '80%', color: '#22c55e', label: 'Strong' },
      { width: '100%', color: '#16a34a', label: 'Very Strong' },
    ];
    const level = levels[Math.min(score, levels.length - 1)];
    fillEl.style.width = level.width;
    fillEl.style.background = level.color;
    labelEl.textContent = level.label;
    labelEl.style.color = level.color;
  });
}

// ─────────────────────────────────────────────
// OTP BOX SETUP
// ─────────────────────────────────────────────
function setupAllOTPBoxes() {
  document.querySelectorAll('.otp-inputs').forEach(container => {
    const boxes = container.querySelectorAll('.otp-box');
    boxes.forEach((box, i) => {
      box.addEventListener('input', () => {
        box.value = box.value.replace(/\D/, '');
        if (box.value && i < boxes.length - 1) boxes[i + 1].focus();
      });
      box.addEventListener('keydown', e => {
        if (e.key === 'Backspace' && !box.value && i > 0) boxes[i - 1].focus();
      });
      box.addEventListener('paste', e => {
        const paste = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
        if (paste.length >= 6) {
          boxes.forEach((b, j) => { b.value = paste[j] || ''; });
          boxes[Math.min(paste.length - 1, boxes.length - 1)].focus();
        }
        e.preventDefault();
      });
    });
  });
}

function clearOTPBoxes(selector) {
  document.querySelectorAll(selector).forEach(b => b.value = '');
}

// ─────────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────────
function logout() {
  // Save user-specific path before logout
  if (state.user?.email && state.path) {
    localStorage.setItem('ls_path_' + state.user.email, JSON.stringify(state.path));
    localStorage.setItem('ls_summary_' + state.user.email, state.skillGapSummary);
  }

  localStorage.removeItem('ls_token');
  localStorage.removeItem('ls_user');
  localStorage.removeItem('ls_path');
  localStorage.removeItem('ls_summary');

  state.token = null;
  state.user = null;
  state.path = null;
  state.skillGapSummary = '';
  state.testQuestions = [];
  state.currentQuestion = 0;
  state.score = 0;
  state.answers = [];

  showPage('login');
  loginGoBack();
}

// ─────────────────────────────────────────────
// ONBOARDING
// ─────────────────────────────────────────────
function obNext(step) {
  if (step === 1) {
    const skills = document.getElementById('ob-skills').value.trim();
    if (!skills) { alert('Please enter your current skills.'); return; }
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
  const fromDot = document.getElementById('sdot' + from);
  const toDot = document.getElementById('sdot' + to);
  if (to > from) {
    fromDot.classList.remove('active');
    fromDot.classList.add('done');
  }
  toDot.classList.add('active');
  toDot.classList.remove('done');
}

async function submitOnboarding() {
  const skills = document.getElementById('ob-skills').value.trim().split(',').map(s => s.trim()).filter(Boolean);
  const goal = document.getElementById('ob-goal-custom').value.trim() || document.getElementById('ob-goal').value;
  const cert = document.getElementById('ob-cert').value;
  const level = document.getElementById('ob-level').value;

  const btn = document.getElementById('btn-ob-finish');
  btn.disabled = true;
  btn.textContent = '⏳ Analyzing Profile…';

  setTimeout(() => {
    state.user.currentSkills = skills;
    state.user.learningGoal = goal;
    state.user.targetCertification = cert;
    state.user.experienceLevel = level;
    state.user.onboardingComplete = true;

    // Update registered user data
    if (state.registeredUsers[state.user.email]) {
      Object.assign(state.registeredUsers[state.user.email], {
        onboardingComplete: true,
        currentSkills: skills,
        learningGoal: goal,
        targetCertification: cert,
        experienceLevel: level
      });
    }

    saveState();
    showPage('app');
    updateHeaderUser();
    generatePath();

    btn.disabled = false;
    btn.textContent = '🚀 Generate My Path';
  }, 1500);
}

// ─────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────
function loadDashboard() {
  updateHeaderUser();
  if (state.path) {
    updateDashboardUI();
    showDashboardContent();
  } else {
    showNoPaths();
  }
}

function showDashboardContent() {
  hideSection('no-path-msg');
  hideSection('loading-path');
  document.getElementById('hero-banner').style.display = '';
  document.getElementById('timeline-section').style.display = '';
  document.getElementById('skill-gap-section').style.display = '';
}

function showNoPaths() {
  showSection('no-path-msg');
  document.getElementById('hero-banner').style.display = 'none';
  document.getElementById('timeline-section').style.display = 'none';
  document.getElementById('skill-gap-section').style.display = 'none';
}

function generatePath() {
  showSection('loading-path');
  hideSection('no-path-msg');
  document.getElementById('hero-banner').style.display = 'none';
  document.getElementById('timeline-section').style.display = 'none';
  document.getElementById('skill-gap-section').style.display = 'none';

  setTimeout(() => {
    const goal = state.user.learningGoal || 'Software Developer';
    const cert = state.user.targetCertification || 'AWS Cloud Practitioner';
    const skills = state.user.currentSkills?.join(', ') || 'basic programming';

    state.skillGapSummary = `Based on your goal to become a ${goal}, you have a strong foundation with ${skills}. However, you are missing core advanced concepts required for the ${cert} certification. You need to strengthen your architectural understanding, hands-on deployment skills, and domain-specific expertise to close the gap.`;

    state.path = {
      goal,
      certification: cert,
      readinessScore: 40,
      totalTopics: 10,
      completedCount: 0,
      phases: [
        {
          phaseName: 'Phase 1: Core Fundamentals',
          duration: '1 Week',
          icon: '📐',
          topics: [
            { title: 'Architecture Patterns & Principles', description: 'Master the foundational design patterns required for enterprise applications.', completed: false, resources: [{ label: 'Documentation', url: '#' }] },
            { title: 'Security Best Practices & IAM', description: 'Implement standard security measures, identity and access management.', completed: false, resources: [{ label: 'Security Guide', url: '#' }] }
          ]
        },
        {
          phaseName: 'Phase 2: Specialized Skills',
          duration: '2 Weeks',
          icon: '🧩',
          topics: [
            { title: 'Database Design & Optimization', description: 'Master NoSQL and SQL database optimization techniques.', completed: false, resources: [{ label: 'DB Tutorial', url: '#' }] },
            { title: 'API Gateway & Microservices', description: 'Design scalable APIs with rate limiting and load balancing.', completed: false, resources: [{ label: 'API Guide', url: '#' }] }
          ]
        },
        {
          phaseName: 'Phase 3: Advanced Concepts',
          duration: '2 Weeks',
          icon: '🚀',
          topics: [
            { title: 'Cloud Infrastructure & IaC', description: 'Learn Infrastructure as Code with Terraform and CloudFormation.', completed: false, resources: [{ label: 'IaC Lab', url: '#' }] },
            { title: 'Monitoring & Observability', description: 'Implement logging, metrics, and alerting systems.', completed: false, resources: [{ label: 'Monitoring Guide', url: '#' }] }
          ]
        },
        {
          phaseName: 'Phase 4: Deployment & CI/CD',
          duration: '1 Week',
          icon: '⚙️',
          topics: [
            { title: 'CI/CD Pipeline Setup', description: 'Automate testing and deployment using GitHub Actions or Jenkins.', completed: false, resources: [{ label: 'CI/CD Guide', url: '#' }] },
            { title: 'Container Orchestration', description: 'Deploy and manage containers with Docker and Kubernetes.', completed: false, resources: [{ label: 'K8s Lab', url: '#' }] }
          ]
        },
        {
          phaseName: 'Phase 5: Exam Prep',
          duration: '1 Week',
          icon: '🎯',
          topics: [
            { title: 'Practice Exams & Review', description: 'Complete multiple practice exams and review weak areas.', completed: false, resources: [{ label: 'Mock Exams', url: '#' }] },
            { title: 'Final Readiness Assessment', description: 'Take a comprehensive assessment to validate exam readiness.', completed: false, resources: [{ label: 'Assessment', url: '#' }] }
          ]
        }
      ]
    };

    // Save per-user
    if (state.user?.email) {
      localStorage.setItem('ls_path_' + state.user.email, JSON.stringify(state.path));
      localStorage.setItem('ls_summary_' + state.user.email, state.skillGapSummary);
    }

    saveState();
    hideSection('loading-path');
    updateDashboardUI();
    showDashboardContent();
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

  // Hero banner
  const heroGoal = document.getElementById('hero-goal');
  if (heroGoal) heroGoal.textContent = p.goal || 'Career';

  const heroDesc = document.getElementById('hero-desc');
  if (heroDesc) heroDesc.textContent = `Based on your skill gap analysis, we've created a roadmap tailored for ${p.goal}. Target: ${p.certification}.`;

  // Readiness meter
  setReadiness(p.readinessScore);
  const meterCert = document.getElementById('meter-cert');
  if (meterCert) meterCert.textContent = p.certification || 'Certification';

  // Stats
  document.getElementById('stat-completed').textContent = p.completedCount || 0;
  document.getElementById('stat-remaining').textContent = (p.totalTopics - (p.completedCount || 0));
  document.getElementById('stat-phases').textContent = p.phases?.length || 0;

  // Estimate total hours
  let totalHours = 0;
  p.phases.forEach(phase => {
    const match = phase.duration?.match(/(\d+)/);
    const weeks = match ? parseInt(match[1]) : 1;
    totalHours += weeks * 10;
  });
  document.getElementById('stat-hours').textContent = totalHours + 'h';

  // Skill Gap
  if (state.skillGapSummary) {
    document.getElementById('skill-gap-summary').textContent = state.skillGapSummary;
  }

  const tagsEl = document.getElementById('skills-tags');
  tagsEl.innerHTML = '';
  if (state.user?.currentSkills?.length) {
    state.user.currentSkills.forEach(s => {
      const tag = document.createElement('span');
      tag.className = 'skill-tag';
      tag.textContent = s;
      tagsEl.appendChild(tag);
    });
  }

  // Timeline cards
  renderTimelineCards();
}

function setReadiness(pct) {
  const circle = document.getElementById('meter-fill');
  if (!circle) return;
  const circumference = 2 * Math.PI * 68; // r=68
  const offset = circumference - (pct / 100) * circumference;
  circle.style.strokeDashoffset = offset;
  document.getElementById('meter-pct').textContent = pct + '%';
}

function renderTimelineCards() {
  const container = document.getElementById('timeline-cards');
  if (!container || !state.path) return;

  const icons = ['📐', '🧩', '🚀', '⚙️', '🎯'];
  container.innerHTML = state.path.phases.map((phase, i) => {
    const completedTopics = phase.topics.filter(t => t.completed).length;
    const totalTopics = phase.topics.length;
    const isCompleted = completedTopics === totalTopics;
    const inProgress = completedTopics > 0 && !isCompleted;
    const statusClass = isCompleted ? 'completed' : inProgress ? 'in-progress' : 'not-started';
    const statusLabel = isCompleted ? 'Completed' : inProgress ? 'In Progress' : 'Not Started';

    return `
      <div class="timeline-card ${isCompleted ? 'completed' : ''}">
        <div class="tc-icon">${phase.icon || icons[i] || '📚'}</div>
        <div class="tc-phase">Phase ${i + 1}</div>
        <div class="tc-title">${escHtml(phase.phaseName.replace(/Phase \d+:\s*/, ''))}</div>
        <div class="tc-meta">
          <span class="tc-time">⏱ ${escHtml(phase.duration || 'TBD')}</span>
          <span class="tc-status ${statusClass}">${statusLabel}</span>
        </div>
      </div>
    `;
  }).join('');
}

function updateHeaderUser() {
  if (!state.user) return;
  const name = state.user.name || state.user.email?.split('@')[0] || 'User';
  document.getElementById('header-user-name').textContent = name;
  document.getElementById('header-avatar').textContent = name.charAt(0).toUpperCase();
}

// ─────────────────────────────────────────────
// ROADMAP
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
              ${!topic.completed
    ? `<button class="btn-complete" onclick="markComplete(${pi},${ti})">Mark Done</button>`
    : `<span class="btn-complete done">✓ Done</span>`}
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
  const initialScore = 40;
  p.readinessScore = Math.min(100, Math.round(initialScore + (100 - initialScore) * (completedCount / p.totalTopics)));

  // Save per-user
  if (state.user?.email) {
    localStorage.setItem('ls_path_' + state.user.email, JSON.stringify(state.path));
  }

  saveState();
  renderRoadmap();
  updateDashboardUI();
}

// ─────────────────────────────────────────────
// MOCK TEST
// ─────────────────────────────────────────────
function startMockTest() {
  if (!state.path) { alert('Generate a learning path first!'); return; }
  document.getElementById('test-start').classList.add('hidden');
  document.getElementById('test-loading').classList.remove('hidden');

  setTimeout(() => {
    const goal = state.user?.learningGoal || 'Software Development';
    const cert = state.user?.targetCertification || 'Certification';

    state.testQuestions = [
      {
        question: `Which of the following describes the key benefit of leveraging a CI/CD pipeline for your ${goal} projects?`,
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
        question: `Which service is most relevant for optimizing database reads for your ${cert} preparation?`,
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
          <button class="option-btn" id="opt-${i}" onclick="selectAnswer(${i}, '${escHtml(q.answer)}', ${JSON.stringify(q.explanation).replace(/"/g, '&quot;')})">
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
  const correctIdx = ['A', 'B', 'C', 'D'].indexOf(correctLetter.toUpperCase());
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
      <span>Q${i + 1}: ${escHtml(state.testQuestions[i]?.question || '')}</span>
    </div>
  `).join('');
}

function resetTest() {
  document.getElementById('test-results').classList.add('hidden');
  document.getElementById('test-area').classList.add('hidden');
  document.getElementById('test-start').classList.remove('hidden');
  state.testQuestions = [];
  state.currentQuestion = 0;
  state.score = 0;
  state.answers = [];
  document.getElementById('test-prog-fill').style.width = '0%';
}

// ─────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────
function showSection(id) { document.getElementById(id)?.classList.remove('hidden'); }
function hideSection(id) { document.getElementById(id)?.classList.add('hidden'); }
function showError(el, msg) { el.textContent = msg; el.classList.remove('hidden'); }
function escHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
