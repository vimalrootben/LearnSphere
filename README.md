# 🎓 LEARNSPHERE
### Smart Personalized Learning – Phase-by-Phase Roadmap & Certification Readiness
**SDG 4 – Quality Education | SKILL23 EdTech Theme**

LearnSphere is a modern, AI-powered ed-tech platform that mirrors the corporate yet minimalist feel of industry leaders like Coursera. It analyzes your current skills against your career goals to generate a personalized, phase-based learning timeline and tracks your certification readiness in real-time.

---

## 🎨 New UI & Aesthetic
The platform has been completely rebuilt with a **Corporate-Minimalist Light Theme**:
- **Coursera-Inspired Layout**: Clean white header, off-white background (#F5F7FA).
- **Hero Banner**: Mint-green (#E6F4EA) hero section with a personalized headline and **40% Readiness Meter**.
- **Visuals**: Smooth progress rings, horizontal scrollable timeline cards, and clean typography (Inter).

---

## 🔐 Advanced Authentication & Security
A secure, multi-step authentication system has been implemented:
- **Signup**: Full registration (Name, Gmail, Password) → 6-digit OTP verification via Resend API → Redirect to Login.
- **Login**: Two-step flow (Email → Password → OTP Verification) for maximum security.
- **RBAC**: Role-Based Access Control to protect sensitive routes and block unauthorized admin access.
- **Password Security**: Built-in password strength meter and visibility toggles.
- **OTP Service**: Integrated with **Resend API** for reliable email delivery.

---

## ✨ Core Features
| Feature | Description |
|---|---|
| 🧠 **AI Skill Gap Analysis** | Compares your current skills against your target role (Full Stack, Data Science, etc.). |
| 🗺️ **Multi-Step Timeline** | Horizontal, phase-based roadmap (e.g., Phase 1: Core Fundamentals) with duration and status badges. |
| 📊 **Readiness Meter** | Visual green circular progress ring showing how ready you are for your target certification (AWS, PMP, Cisco, CompTIA). |
| 📊 **Real-time Stats** | Track "Completed", "Remaining", "Phases", and "Estimated Time" directly on your dashboard. |
| 📝 **AI Mock Tests** | Practice MCQs generated specifically for your identified skill gaps. |
| 🔄 **Persistence** | Session-based state management with per-user path saving. |

---

## 📁 Project Structure
```
LearnSphere/
├── frontend/
│   ├── index.html          ← Main App (Split Auth, Dashboard, Onboarding)
│   ├── css/style.css       ← Clean Corporate-Minimalist CSS
│   └── js/app.js           ← Full Auth Logic, OTP, RBAC, and Dashboard Engine
└── backend/
    ├── server.js           ← Express API (JWT, Gemini AI, Resend SMTP)
    ├── package.json        ← Backend Dependencies
    ├── models/             ← Mongoose Schemas (User, LearningPath)
    └── routes/             ← API Handlers (Auth, Path Generation)
```

---

## 🏗️ Getting Started

### 1. Frontend
The frontend is a standalone HTML/CSS/JS application. 
- Open `frontend/index.html` in your browser.
- *Note: For full authentication functionality, ensure the backend or a local server is running.*

### 2. Backend Setup
1. `cd backend`
2. `npm install`
3. Configure your `.env` with:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `GEMINI_API_KEY`
   - `RESEND_API_KEY` (re_JVdRXyad...)
4. `npm start`

---

## 🏗️ Architecture
```
User → Frontend (HTML5/CSS3/JS)
          ↓ REST API (JWT + RBAC)
     Express Backend
        ├── MongoDB         ← Profiles & Saved Paths
        ├── Resend API      ← Secure OTP Delivery
        └── Gemini AI       ← Personalized Path & MCQ Generation
```
