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
const MAX_RETRIES = 3;

async function generateWithRetry(prompt, retries = 0) {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
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
You are a senior curriculum architect.

Generate a COMPLETE professional course STRUCTURE based on this text.

STRICT RULES:
- Exactly 8 to 10 modules.
- DO NOT generate lessons yet.
- You MUST return a valid JSON object matching the exact format below. Do not include markdown or conversational text.

FORMAT:
{
  "title": "String",
  "description": "String",
  "level": "Beginner to Advanced",
  "duration": "String",
  "modules": [
    {
      "title": "String",
      "description": "String"
    }
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
You are a senior instructor creating course material.

Course: ${courseTitle}
Module: ${moduleTitle}

Generate EXACTLY 4 detailed lessons for this module.

CRITICAL JSON String Escaping Rules:
1. ALL strings must be valid JSON strings.
2. In the "code" field, you MUST escape ALL newlines as \\n. YOU CANNOT have literal newlines inside the JSON string value.
3. In the "code" field, escape double quotes as \\".
4. Use single quotes for HTML attributes or standard Javascript strings if possible to avoid escaping hell.
5. NEVER return unescaped raw code blocks inside the JSON.
6. The entire response must be a single, valid JSON object. Do not wrap it in markdown.

FORMAT:
{
  "lessons": [
    {
      "title": "String",
      "content": "String (2 paragraphs max)",
      "examples": "String",
      "language": "String (e.g. javascript, jsx, html, css, python, java, c++, sql)",
      "code": "const a = 1;\\nconst b = 2;",
      "quiz": [
        {
          "question": "String",
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
          "answer": "Option 1"
        }
      ],
      "assignment": "String",
      "interviewQuestions": ["String", "String", "String"]
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

  // Process sequentially to avoid Groq rate limits or context crashing
  for (const module of blueprint.modules) {
    try {
      const lessons = await generateLessonsForModule(blueprint.title, module.title);
      module.lessons = lessons;
    } catch (err) {
      console.error(`Failed to generate lessons for module: ${module.title}`);
      module.lessons = []; // Fallback empty lessons so course doesn't entirely crash
    }
  }

  return blueprint;
};