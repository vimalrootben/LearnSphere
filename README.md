# 🎓 LEARNSPHERE AI
### Next-Gen Personalised Learning Platform | Powered by Google Gemini 2.5 Flash
**SDG 4 – Quality Education | GenAI Ecosystem Implementation**

LearnSphere is a premium, AI-driven ed-tech platform that generates personalised 4-phase learning roadmaps and provides a continuous, context-aware AI Tutoring experience. It features a unified chat ecosystem with **LSphere AI** (Full-Page) and **LS Mini** (Floating Assistant).

---

## 🎨 Design & Aesthetic
The platform uses a **Premium Antigravity Design System**:
- **Glassmorphism & Neon Accents**: Modern, high-end visual feel.
- **Dynamic Hero Banner**: Personalised headlines and real-time **Readiness Meter**.
- **Interactive Timeline**: Responsive, animated phase cards with progress tracking.
- **LS Mini Widget**: A sleek, floating AI assistant always available for quick queries.

---

## 💬 LSphere AI Ecosystem
A unified Generative AI experience:
- **LSphere AI (Full-Page)**: A ChatGPT-style interface with a dark sidebar for persistent conversation threads.
- **LS Mini (Floating)**: A compact version of the assistant that synced with your main chat history.
- **Smart Redirection**: The AI understands your learning intent. Ask *"Teach me Cybersecurity"* and the platform automatically navigates you to the relevant Explore section!
- **Context Awareness**: The AI knows which certification you are targeting and tailors its tutoring to your current roadmap phase.

---

## ✨ Core Features
| Feature | Description |
|---|---|
| 🧠 **AI Learning Path** | Generates a structured 4-phase roadmap (Foundations → Core → Advanced → Mastery) using Gemini. |
| 📊 **Readiness Meter** | Visual circular progress ring showing your certification preparedness in real-time. |
| 🤖 **Unified AI Tutor** | Shared chat memory between the full-page LSphere AI and the floating LS Mini assistant. |
| 🗺️ **Smart Navigation** | AI intent-based automatic redirection to learning domains and sub-domains. |
| 📝 **AI Mock Tests** | 10-question MCQ quizzes generated per phase to validate your progress. |
| 🔄 **State Persistence** | All learning paths, completed topics, and chat threads are saved via `localStorage`. |

---

## 📂 Project Structure
```
LearnSphere/
├── app.py                ← Flask Backend (Secure Gemini 2.5 Flash Proxy)
└── frontend/
    ├── index.html        ← SPA Entry Point (Onboarding, Dashboard, LSphere AI)
    ├── css/
    │   └── style.css     ← Antigravity Design System & Chat Layouts
    └── js/
        ├── app.js        ← Ecosystem Engine (Shared Chat, Navigation, AI State)
        ├── domains.js    ← Domain Data (100+ Certification Profiles)
        └── quiz-data.js  ← Mock Test Question Repository
```

---

## 🏗️ Getting Started

### 1. Prerequisites
- Python 3.8+
- `google-genai` and `flask-cors` libraries

### 2. Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/vimalrootbeen/LearnSphere.git
   cd LearnSphere
   ```
2. Install dependencies:
   ```bash
   pip install flask flask-cors google-genai
   ```
3. Run the application:
   ```bash
   python app.py
   ```
4. Open the platform:
   Visit **http://localhost:5000** in your browser.

---

## 🏗️ Architecture
```
User → Browser (SPA: HTML/CSS/JS)
          ↓ (Secure Proxy via Flask)
      Python Backend (app.py)
          ↓ (New GenAI SDK)
      Google Gemini 2.5 Flash
```
- **Security**: The Gemini API Key is stored securely on the backend in `app.py`.
- **Ecosystem**: Shared `chatHistory` state ensures a seamless experience between full-page and mini chat modes.
