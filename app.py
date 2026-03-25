import os
import json
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from google import genai

# ─── CONFIGURATION ───
GEMINI_API_KEY = "AIzaSyAxFGZx63FuAcg4DrdDubl6mOrfchtOimY"
client = genai.Client(api_key=GEMINI_API_KEY)
MODEL = "gemini-2.5-flash"

app = Flask(__name__, static_folder="frontend", static_url_path="")
CORS(app)

# ─── SERVE FRONTEND ───
@app.route("/")
def index():
    return send_from_directory("frontend", "index.html")

@app.route("/<path:path>")
def static_files(path):
    return send_from_directory("frontend", path)


# ─── HELPER: Call Gemini ───
def call_gemini(prompt):
    response = client.models.generate_content(
        model=MODEL,
        contents=prompt
    )
    return response.text.strip()


# ─── API: Generate Learning Path ───
@app.route("/api/generate-path", methods=["POST"])
def generate_path():
    data = request.json
    domain = data.get("domain", "Technology")
    goal   = data.get("goal", "Developer")
    cert   = data.get("certification", "General")

    prompt = f"""You are an expert AI curriculum designer for an EdTech platform.
Generate a structured 4-phase learning roadmap for:
- Domain: {domain}
- Career Goal: {goal}
- Target Certification: {cert}

Return ONLY valid JSON (no markdown, no explanation) with this exact schema:
{{
  "phases": [
    {{
      "name": "Phase name",
      "icon": "single emoji",
      "hours": 12,
      "topics": ["Topic 1", "Topic 2", "Topic 3"]
    }}
  ]
}}
Requirements: exactly 4 phases, 3-4 topics each, realistic hours (10-20 per phase)."""

    try:
        text = call_gemini(prompt)

        # Strip markdown fences if present
        if "```" in text:
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
            text = text.strip()

        parsed = json.loads(text)
        phases = []
        for i, p in enumerate(parsed["phases"]):
            phases.append({
                "name": p["name"],
                "icon": p.get("icon", "📚"),
                "hours": p.get("hours", 12),
                "topics": p["topics"],
                "phaseNum": i + 1,
                "status": "not-started",
                "topicStatus": [{"completed": False, "quizPassed": False} for _ in p["topics"]]
            })

        return jsonify({"success": True, "phases": phases})

    except Exception as e:
        print(f"Gemini generate-path error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


# ─── API: Chat with AI Tutor ───
@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.json
    messages = data.get("messages", [])
    user_context = data.get("context", "")

    cert_info = f" The student is preparing for: {user_context}." if user_context else ""

    # Build conversation history (last 10 messages)
    history_str = ""
    for msg in messages[-10:]:
        role = "User" if msg["role"] == "user" else "AI"
        content = msg['content'].replace('<br>', '\n').replace('<strong>', '').replace('</strong>', '').replace('&lt;', '<').replace('&gt;', '>').replace('&amp;', '&')
        history_str += f"{role}: {content}\n"

    full_prompt = f"""You are LSphere AI, a helpful expert tutor for IT certifications and career development.{cert_info}
Give encouraging, expert answers. Be concise and practical. You can use line breaks for readability.

Try to respond in this JSON format:
{{"reply": "your answer here", "redirectDomain": null}}

If the user asks to learn or explore a specific domain, set redirectDomain to one of:
'Core IT & Software', 'Cybersecurity', 'Data & Analytics', 'Cloud Computing',
'AI & Machine Learning', 'Networking & Infrastructure', 'Business + Tech', 'Creative & Design'
Otherwise keep redirectDomain as null.

Conversation:
{history_str}AI:"""

    try:
        text = call_gemini(full_prompt)

        # Try JSON parse first
        try:
            clean = text
            if "```" in clean:
                clean = clean.split("```")[1]
                if clean.startswith("json"):
                    clean = clean[4:]
                clean = clean.strip()

            parsed = json.loads(clean)
            return jsonify({
                "success": True,
                "reply": parsed.get("reply", text),
                "redirectDomain": parsed.get("redirectDomain")
            })

        except (json.JSONDecodeError, KeyError):
            # Gemini returned plain text — that's fine, use it directly
            return jsonify({
                "success": True,
                "reply": text,
                "redirectDomain": None
            })

    except Exception as e:
        err_str = str(e)
        print(f"Gemini chat error: {err_str}")
        if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str:
            return jsonify({"success": False, "error": "API quota exceeded. Please wait a moment and try again."}), 429
        return jsonify({"success": False, "error": err_str}), 500


if __name__ == "__main__":
    print("=" * 50)
    print("🚀 LearnSphere AI Server Running!")
    print("👉 Open your browser at: http://localhost:5000")
    print("🤖 Powered by Google Gemini AI (gemini-2.0-flash)")
    print("=" * 50)
    app.run(host="0.0.0.0", port=5000, debug=False)
