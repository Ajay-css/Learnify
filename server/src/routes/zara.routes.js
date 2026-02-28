import { Router } from "express";
import { chatWithZara } from "../services/zaraChat.service.js";

const router = Router();

// POST /api/zara/chat
router.post("/chat", async (req, res) => {
    try {
        const { userMessage, lessonContext, chatHistory } = req.body;

        if (!userMessage || typeof userMessage !== "string" || userMessage.trim() === "") {
            return res.status(400).json({ error: "userMessage is required." });
        }

        const reply = await chatWithZara({
            userMessage: userMessage.trim(),
            lessonContext,
            chatHistory,
        });

        return res.json({ reply });
    } catch (err) {
        console.error("[Zara AI Error]", err.message);
        return res.status(500).json({ error: "Zara AI is currently unavailable. Please try again." });
    }
});

export default router;
