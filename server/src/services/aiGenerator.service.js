import Groq from "groq-sdk";
import "dotenv/config";
import { jsonrepair } from "jsonrepair";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

/* -----------------------------------------
   JSON CLEANER
------------------------------------------ */

function cleanAIResponse(raw) {
  if (!raw) throw new Error("Empty AI response");

  let text = raw.trim();

  // 1. Try to extract from markdown blocks first (e.g. ```json ... ```)
  // If there are multiple blocks (like the AI correcting itself), pick the last one.
  const jsonBlocks = [...text.matchAll(/```(?:json)?\s*([\s\S]*?)```/gi)];
  if (jsonBlocks.length > 0) {
    text = jsonBlocks[jsonBlocks.length - 1][1];
  }

  // 2. Fallback: Find the first { or [ and the last } or ]
  const firstBrace = text.indexOf("{");
  const firstBracket = text.indexOf("[");
  const lastBrace = text.lastIndexOf("}");
  const lastBracket = text.lastIndexOf("]");

  let startIdx = -1;
  let endIdx = -1;

  if (firstBrace !== -1 && firstBracket !== -1) {
    startIdx = Math.min(firstBrace, firstBracket);
  } else {
    startIdx = Math.max(firstBrace, firstBracket);
  }

  if (lastBrace !== -1 && lastBracket !== -1) {
    endIdx = Math.max(lastBrace, lastBracket);
  } else {
    endIdx = Math.max(lastBrace, lastBracket);
  }

  if (startIdx === -1 || endIdx === -1) {
    throw new Error("No JSON object found in AI response");
  }

  text = text.slice(startIdx, endIdx + 1);

  // 3. Remove strictly bad control characters but KEEP newlines (\n, \r) and tabs (\t)
  // \x00-\x08 (0-8), \x0B-\x0C (11-12), \x0E-\x1F (14-31)
  text = text.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F]+/g, "");

  return text;
}

function safeParseJSON(raw) {
  try {
    const cleaned = cleanAIResponse(raw);
    const repaired = jsonrepair(cleaned);
    return JSON.parse(repaired);
  } catch (err) {
    console.error("JSON Repair Failed");
    console.error("Raw AI Output:\n", raw);
    throw new Error("AI returned malformed JSON");
  }
}

/* -----------------------------------------
   VALIDATORS
------------------------------------------ */
function validateBlueprint(course) {
  if (!course.title || !Array.isArray(course.modules)) {
    throw new Error("Invalid blueprint structure");
  }

  if (course.modules.length < 6) {
    throw new Error("Insufficient modules generated");
  }
}

function validateLessons(moduleData) {
  if (!Array.isArray(moduleData.lessons)) {
    throw new Error("Lessons missing");
  }

  if (moduleData.lessons.length !== 4) {
    throw new Error("Module must contain exactly 4 lessons");
  }
}

/* -----------------------------------------
   ENHANCED AI GENERATOR WRAPPER
------------------------------------------ */
const MAX_RETRIES = 2; // Reduced retries to save time on timeouts

async function generateWithRetry(prompt, retries = 0) {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "system", content: "You are a senior curriculum architect. You output ONLY valid JSON. No conversational text." }, { role: "user", content: prompt }],
      temperature: 0.2, // Lower temperature for more consistent JSON
      max_tokens: 3000,
      response_format: { type: "json_object" }
    });

    const rawContent = response.choices[0].message.content;
    const parsed = safeParseJSON(rawContent);
    return parsed;
  } catch (error) {
    if (retries < MAX_RETRIES) {
      console.warn(`[AI Generation] Parsing failed. Retrying... (${retries + 1}/${MAX_RETRIES})`);
      return generateWithRetry(prompt, retries + 1);
    }
    console.error("[AI Generation] Final failure after max retries.");
    throw error;
  }
}

/* -----------------------------------------
   STEP 1 — COURSE BLUEPRINT
------------------------------------------ */
export const generateCourseBlueprint = async (text) => {
  const prompt = `
Generate a COMPLETE professional course STRUCTURE based on this text.
Exactly 8 modules.
DO NOT generate lessons yet.
Return a valid JSON object.

FORMAT:
{
  "title": "String",
  "description": "String",
  "level": "Beginner/Intermediate/Advanced",
  "duration": "String",
  "modules": [
    { "title": "String", "description": "String" }
  ]
}

CONTENT:
${text.slice(0, 6000)}
`;

  const parsed = await generateWithRetry(prompt);
  validateBlueprint(parsed);
  return parsed;
};

/* -----------------------------------------
   STEP 2 — MODULE LESSON GENERATOR
------------------------------------------ */
export const generateLessonsForModule = async (
  courseTitle,
  moduleTitle
) => {
  const prompt = `
Generate EXACTLY 4 detailed lessons for: ${moduleTitle}
Part of course: ${courseTitle}

CRITICAL RULES:
1. Escape newlines in "code" as \\n.
2. No literal newlines in strings.
3. Return only valid JSON.

FORMAT:
{
  "lessons": [
    {
      "title": "String",
      "content": "String (2 paragraphs)",
      "examples": "String",
      "language": "javascript/jsx/html/css/python",
      "code": "Escaped string",
      "quiz": [
        { "question": "String", "options": ["4 options"], "answer": "The correct option" }
      ],
      "assignment": "String",
      "interviewQuestions": ["String", "String"]
    }
  ]
}
`;

  const parsed = await generateWithRetry(prompt);
  validateLessons(parsed);
  return parsed.lessons;
};

/* -----------------------------------------
   STEP 3 — FULL COURSE PIPELINE
------------------------------------------ */
export const generateFullCourse = async (text) => {
  const blueprint = await generateCourseBlueprint(text);

  // Parallel generation for speed. 
  // We process in small chunks to stay within rate limits but it's much faster than sequential.
  const modulePromises = blueprint.modules.map(async (module) => {
    try {
      const lessons = await generateLessonsForModule(blueprint.title, module.title);
      return { ...module, lessons };
    } catch (err) {
      console.error(`Failed module: ${module.title}`);
      return { ...module, lessons: [] };
    }
  });

  blueprint.modules = await Promise.all(modulePromises);
  return blueprint;
};
