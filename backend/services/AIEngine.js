const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate a structured adaptive learning path using Gemini.
 * @param {string} currentSkills - Comma-separated user skills
 * @param {string} goal - Career or learning goal
 * @param {string} certification - Target certification
 * @param {string} level - beginner | intermediate | advanced
 */
const generateLearningPath = async (currentSkills, goal, certification, level) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
You are an expert education advisor. A student has the following profile:
- Current Skills: ${currentSkills || 'None'}
- Career Goal: ${goal}
- Target Certification: ${certification}
- Experience Level: ${level}

Perform a skill gap analysis and generate a detailed, adaptive learning roadmap.

Respond ONLY with a valid JSON object using this exact structure:
{
  "readinessScore": <number 0-100 based on current skills vs goal>,
  "skillGapSummary": "<2-3 sentence summary of skill gaps>",
  "phases": [
    {
      "phaseName": "<Phase name, e.g. 'Phase 1: Foundations'>",
      "duration": "<estimated duration, e.g. '2 weeks'>",
      "topics": [
        {
          "title": "<Topic title>",
          "description": "<1 sentence why this is important>",
          "resources": [
            { "label": "<Resource name>", "url": "<real URL or platform name>" }
          ]
        }
      ]
    }
  ]
}

Generate 3-4 phases with 3-5 topics each. Make it practical and specific to the student's goal.
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Extract JSON from markdown code fence if present
  const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/({[\s\S]*})/);
  const jsonStr = jsonMatch ? jsonMatch[1] : text;

  return JSON.parse(jsonStr.trim());
};

/**
 * Generate 5 MCQ mock test questions based on skill gaps.
 */
const generateMockTest = async (goal, skillGapSummary, topics) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
You are an expert examiner. Generate exactly 5 multiple-choice questions for a student learning:
- Goal: ${goal}
- Skill Gap Summary: ${skillGapSummary}
- Current Study Topics: ${topics.join(', ')}

Respond ONLY with a valid JSON array:
[
  {
    "question": "<question text>",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "answer": "<correct option letter, e.g. A>",
    "explanation": "<brief explanation why>"
  }
]

Make questions practical, clear, and relevant to the topics listed.
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/(\[[\s\S]*\])/);
  const jsonStr = jsonMatch ? jsonMatch[1] : text;
  return JSON.parse(jsonStr.trim());
};

module.exports = { generateLearningPath, generateMockTest };
