# 🌐 LEARNSPHERE
### GenAI-Powered Personalized Learning Path & Certification Readiness System
**SDG 4 – Quality Education | SKILL23 EdTech Theme**

---

## 📁 Project Structure
```
LearnSphere/
├── frontend/
│   ├── index.html          ← Main app (all pages)
│   ├── css/style.css       ← Full glassmorphism UI
│   └── js/app.js           ← All frontend logic
└── backend/
    ├── server.js           ← Express entry point
    ├── .env.example        ← Config template
    ├── models/
    │   ├── User.js         ← User schema (OTP, profile, progress)
    │   └── LearningPath.js ← AI path schema
    ├── services/
    │   ├── AuthService.js  ← OTP generation + Nodemailer email
    │   └── AIEngine.js     ← Gemini AI integration
    └── routes/
        ├── auth.js         ← /send-otp, /verify-otp, /onboarding, /me
        ├── path.js         ← /generate, /me, /complete-topic
        └── test.js         ← /generate (mock MCQs)
```

---

## ⚙️ Backend Setup

### 1. Prerequisites
- Node.js v18+ — [nodejs.org](https://nodejs.org)
- MongoDB — [mongodb.com](https://www.mongodb.com/try/download/community)

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Configure Environment
```bash
copy .env.example .env
```
Edit `.env` and fill in:
| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Any random secret string |
| `GEMINI_API_KEY` | From [Google AI Studio](https://aistudio.google.com/) |
| `EMAIL_USER` | Your Gmail address |
| `EMAIL_PASS` | Gmail **App Password** (not your real password!) |

> **Get Gmail App Password:** Google Account → Security → 2-Step Verification → App passwords

### 4. Start Backend
```bash
npm run dev    # development (auto-reload)
# or
npm start      # production
```
Backend runs at `http://localhost:5000`

---

## 🎨 Frontend Setup

No build step needed. Simply open `frontend/index.html` in your browser.

> Make sure the backend is running first so API calls work.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📧 **Email OTP Login** | Secure 6-digit OTP via Gmail SMTP |
| 🧠 **AI Skill Gap Analysis** | Gemini analyzes your skills vs goal |
| 🗺️ **Adaptive Learning Path** | Phase-by-phase AI roadmap |
| 📊 **Readiness Score** | % certification readiness (radial chart) |
| ✅ **Progress Tracking** | Mark topics complete, score updates live |
| 📝 **AI Mock Test** | 5 MCQs generated from your gap topics |

---

## 🔐 Security Features
- OTP cleared from DB immediately after verification
- JWT tokens with 7-day expiry
- API keys stored in `.env` (never committed)
- CORS enabled for cross-origin requests

---

## 🏗️ Architecture
```
User → Frontend (HTML/CSS/JS)
          ↓ REST API (JWT)
     Express Backend
       ├── MongoDB       ← User profiles & paths
       ├── Nodemailer    ← Email OTP delivery
       └── Gemini AI     ← Learning path + test generation
```
