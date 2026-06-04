# 🛠️ ResumeForge

**A full-stack IIT-style resume builder with live preview, PDF export, and AI-powered ATS scoring.**

🔗 **Live Demo:** [resume-forge-gold.vercel.app](https://resume-forge-gold.vercel.app)  
📦 **GitHub:** [github.com/keshavrt/resume-forge](https://github.com/keshavrt/resume-forge)

---

## 🧠 What is this?

ResumeForge is a web app that lets students build clean, IIT Roorkee-style resumes directly in the browser — with a live split-panel preview, one-click PDF export, and an AI-powered ATS (Applicant Tracking System) scorer that gives instant feedback on resume quality.

The idea came from the fact that most IIT students use the same LaTeX template but have no easy way to edit it without knowing LaTeX, and no feedback on whether their resume is actually ATS-friendly for off-campus applications.

---

## ✨ Core Features

- **Split-panel live preview** — form on the left, resume on the right, updates on every keystroke
- **IIT Roorkee resume format** — exact styling, logo, section order used by IITR students
- **AI-powered ATS scorer** — sends resume to Llama 3.3 70B via Groq, returns score, strengths, improvements, and missing keywords
- **PDF export** — print-ready A4 using `react-to-print`, bypasses browser print dialog
- **Bold text support** — custom `BoldTextarea` component with `Ctrl+B` shortcut, renders `**text**` as `<strong>` in preview
- **Import / Export** — resume data saved as JSON for portability
- **Auto-save** — persists to `localStorage` on every change
- **Verified stamp** — green bordered stamp overlay on the preview

---

## 🛠️ Tech Stack & Why I Chose Each

### React 19 + Vite
React's component model made it natural to split the app into `Form`, `Preview`, `ATSScorer`, and `BoldTextarea` — each with a single responsibility. Vite was chosen over CRA because of significantly faster HMR (Hot Module Replacement) during development and leaner build output.

### Tailwind CSS
Utility-first CSS kept the UI consistent without writing a single custom CSS file. It also made responsive design (mobile tab switcher vs desktop split panel) straightforward with breakpoint prefixes like `md:flex`.

### react-to-print
Used for PDF export. It directly prints the resume DOM node with A4 page styles (`@page { size: A4; margin: 0; }`), which produces a pixel-perfect PDF without any backend PDF generation library.

### Groq API (Llama 3.3 70B)
Groq was chosen over OpenAI because it has a genuinely free tier with no credit card required — making the project usable by anyone without cost. Llama 3.3 70B gives high-quality structured JSON responses for the ATS analysis prompt.

### Vercel Serverless Functions
The Groq API key cannot be exposed in frontend code. Instead of running a full Express server in production, I used a Vercel serverless function (`api/analyze.js`) which acts as a secure proxy — the key lives in Vercel's environment variables, never in the client bundle. Locally, an Express server (`server.js`) handles the same proxy role.

### localStorage
Resume data is auto-saved on every state change using a `useEffect` hook. This means users never lose their work even if they close the tab — no database or auth needed for a single-user tool.

---

## 🏗️ Architecture

```
Browser (React)
     │
     │  fills form → state updates → live preview renders
     │
     └──► /api/analyze (POST)
               │
               ├── Local: Express server (server.js) → Groq API
               └── Vercel: Serverless function (api/analyze.js) → Groq API
```

The frontend never talks to Groq directly — all API calls go through the backend proxy. This keeps the API key secure and makes it easy to swap the AI provider later.

---

## 🎯 ATS Scorer — How it works

1. Resume data from React state is serialized into plain text
2. Sent to the backend as a structured prompt asking for JSON output
3. Llama 3.3 70B returns a JSON object with `overallScore`, `sections`, `strengths`, `improvements`, and `missingKeywords`
4. Frontend parses and renders the score ring, bar charts, and keyword tags

The prompt explicitly instructs the model to return **only valid JSON with no markdown or extra text**, and the response is cleaned with `.replace(/```json|```/g, "")` before parsing — handling cases where the model wraps output in code fences anyway.

---

## 📁 Project Structure

```
resume-forge/
├── api/
│   └── analyze.js           # Vercel serverless function (Groq proxy)
├── src/
│   ├── components/
│   │   ├── Form.jsx          # Controlled inputs for all resume sections
│   │   ├── Preview.jsx       # Resume template + scaled live preview + PDF print
│   │   ├── ATSScorer.jsx     # Modal with score ring, bars, keywords
│   │   └── BoldTextarea.jsx  # Textarea with Ctrl+B bold toggle
│   ├── App.jsx               # State management, layout, import/export
│   └── main.jsx
├── server.js                 # Local Express proxy for development
├── .env                      # GROQ_API_KEY (never committed)
└── package.json
```

---

## 🚀 Running Locally

```bash
git clone https://github.com/keshavrt/resume-forge.git
cd resume-forge
npm install
```

Add a `.env` file in the root:
```
GROQ_API_KEY=your_groq_api_key_here
```

Get a free key at [console.groq.com](https://console.groq.com) — no credit card needed.

```bash
npm start
```

This runs the Express backend and Vite frontend together using `concurrently`.

---

## 📄 License

MIT

---

*Built by [keshavrt](https://github.com/keshavrt) — B.Tech 2nd Year, IIT Roorkee*
