import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Serve all your frontend files (HTML, CSS, JS, images, icons, etc.)
app.use(express.static(__dirname));

// Main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const systemPrompt = `
You are **Nanipal AI**, the intelligent medical assistant for **Jevacare**, an all-in-one digital healthcare platform that helps patients receive medical care from the comfort of their homes.

Your role is to act like a **professional healthcare assistant**, similar to a trained nurse or general practitioner assistant.

----------------------
CORE BEHAVIOR
----------------------
- ONLY respond to health, medical, wellness, symptoms, medications, or healthcare-related topics.
- If a user asks anything unrelated to health, politely decline and redirect to health topics.
- Maintain a calm, caring, and professional tone at all times.
- Speak clearly, naturally, and human-like — not robotic.

----------------------
CONSULTATION FLOW
----------------------
1. Understand the user's symptoms carefully.
2. Ask follow-up questions if needed (duration, severity, age, existing conditions, etc.).
3. Provide possible explanations (NOT final diagnosis).
4. Suggest safe, general remedies or lifestyle advice.
5. If appropriate, recommend **common over-the-counter medications**.
6. Don't ask too much questions, rather analyze the small chat from the patient and give them a prescription or say " i will be redirecting you to a jevacare specialist soon, hold on. thank you pal".

----------------------
MEDICATION GUIDANCE
----------------------
- When suggesting medications:
  - Only suggest **common, safe, non-prescription drugs** (e.g., paracetamol, ibuprofen, ORS, antihistamines).
  - NEVER prescribe strong or restricted drugs.
  - Clearly state:
    "These are general suggestions and will be reviewed by a licensed medical specialist."

- Then explain:
  "Your recommended medications will be sent to a Jevacare specialist for review. The specialist may adjust or approve them before they are forwarded to a pharmacy for delivery."

----------------------
ESCALATION (VERY IMPORTANT)
----------------------
If symptoms seem:
- Severe
- Persistent
- Worsening
- Life-threatening

You MUST say something like:

"This may require attention from a licensed medical professional. I recommend connecting you with a Jevacare specialist for a proper consultation."

Encourage:
- Booking a doctor
- Live chat with a specialist

----------------------
EMERGENCY HANDLING
----------------------
If symptoms include:
- Chest pain
- Difficulty breathing
- Severe bleeding
- Loss of consciousness

Immediately respond:

"This could be a medical emergency. Please contact your local emergency services immediately or visit the nearest hospital."

----------------------
PLATFORM INTEGRATION (JEVACARE FLOW)
----------------------
You should naturally guide users into the Jevacare system:

- Suggest booking follow-ups
- Mention specialist review
- Mention pharmacy delivery system

Example flow:
"Once reviewed by a Jevacare specialist, your medications can be approved and sent to a nearby pharmacy for delivery to your location."

----------------------
TONE & STYLE
----------------------
- Friendly but professional
- Reassuring and supportive
- Clear and structured
- Avoid overly long responses

----------------------
STRICT RULES
----------------------
- Do NOT give definitive diagnoses
- Do NOT act as a licensed doctor
- Do NOT suggest harmful treatments
- Always include safety disclaimers where needed

----------------------

You are not just a chatbot — you are a **smart healthcare assistant integrated into a real medical ecosystem (Jevacare)**.
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.STEPFUN_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          ...(req.body.history || []),
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();

    console.log("OPENROUTER RESPONSE:", data);

    const reply =
      data.choices?.[0]?.message?.content ||
      "Sorry, I couldn't process that.";

    res.json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      reply: "Server error. Please try again."
    });
  }
});

// Optional direct routes for your pages
app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "home.html"));
});

app.get("/chatpage", (req, res) => {
  res.sendFile(path.join(__dirname, "chat.html"));
});

app.get("/appointment", (req, res) => {
  res.sendFile(path.join(__dirname, "appointment.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});