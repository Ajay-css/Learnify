import Groq from "groq-sdk";
import "dotenv/config";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const ZARA_SYSTEM_PROMPT = `You are Zara, a friendly and knowledgeable AI learning assistant for the Learnify platform. Your role is to:

1. Help students understand concepts from their current lesson
2. Answer any coding or technical questions clearly and precisely
3. Give simple, easy-to-understand explanations with real-world analogies
4. Encourage students when they are struggling
5. If given lesson context, specifically relate answers to that context
6. Keep responses concise and direct (max 3-4 short paragraphs)
7. Format code snippets properly using backticks

Your personality: warm, encouraging, knowledgeable, like a brilliant senior developer friend who genuinely wants to help you learn. Always address the user in a friendly, conversational tone.`;

export const chatWithZara = async ({ userMessage, lessonContext, chatHistory = [] }) => {
    const messages = [
        { role: "system", content: ZARA_SYSTEM_PROMPT },
    ];

    // Inject current lesson context if provided
    if (lessonContext) {
        messages.push({
            role: "system",
            content: `The student is currently studying this lesson:\n\n**Lesson Title:** ${lessonContext.title}\n**Content:**\n${lessonContext.content || ""}\n\nUse this context to tailor your response if relevant.`
        });
    }

    // Add chat history (last 6 messages max for context window efficiency)
    const recentHistory = chatHistory.slice(-6);
    for (const msg of recentHistory) {
        messages.push({ role: msg.role, content: msg.content });
    }

    // Add the new user message
    messages.push({ role: "user", content: userMessage });

    const response = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages,
        temperature: 0.7,
        max_tokens: 512,
    });

    return response.choices[0].message.content;
};
