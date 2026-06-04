import { useState } from "react";

function ScoreRing({ score }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex flex-col items-center">
      <svg width="100" height="100" className="-rotate-90">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div
        className="relative"
        style={{ marginTop: "-68px", marginBottom: "20px" }}
      >
        <span className="text-2xl font-black" style={{ color }}>
          {score}
        </span>
        <span className="text-sm text-gray-400">/100</span>
      </div>
    </div>
  );
}

function ATSScorer({ resumeData, onClose }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const buildResumeText = () => {
    const r = resumeData;
    const lines = [];
    if (r.name) lines.push(`Name: ${r.name}`);
    if (r.title) lines.push(`Title: ${r.title}`);
    if (r.summary) lines.push(`Area of Interest: ${r.summary}`);
    if (r.education?.some((e) => e.school || e.degree)) {
      lines.push("\nEDUCATION:");
      r.education.forEach((e) => {
        if (e.degree || e.school)
          lines.push(`- ${e.degree} | ${e.school} | ${e.year} | ${e.cgpa}`);
      });
    }
    if (r.experience?.some((e) => e.company || e.role)) {
      lines.push("\nINTERNSHIPS:");
      r.experience.forEach((e) => {
        if (e.role || e.company) {
          lines.push(`- ${e.role} at ${e.company} (${e.duration})`);
          if (e.description) lines.push(e.description);
        }
      });
    }
    if (r.projects?.some((p) => p.name)) {
      lines.push("\nPROJECTS:");
      r.projects.forEach((p) => {
        if (p.name) {
          lines.push(`- ${p.name} | ${p.tech} (${p.duration})`);
          if (p.description) lines.push(p.description);
        }
      });
    }
    if (r.skillRows?.some((s) => s.value)) {
      lines.push("\nSKILLS:");
      r.skillRows.forEach((s) => {
        if (s.value) lines.push(`${s.label}: ${s.value}`);
      });
    }
    if (r.achievements) {
      lines.push("\nACHIEVEMENTS:");
      lines.push(r.achievements);
    }
    if (r.positions?.some((p) => p.role)) {
      lines.push("\nPOSITIONS OF RESPONSIBILITY:");
      r.positions.forEach((p) => {
        if (p.role) {
          lines.push(`- ${p.role} | ${p.org} (${p.duration})`);
          if (p.description) lines.push(p.description);
        }
      });
    }
    return lines.join("\n");
  };

  const analyzeResume = async () => {
    const resumeText = buildResumeText();
    if (resumeText.trim().length < 50) {
      setError(
        "Please fill in more resume details before running the ATS check.",
      );
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const prompt = `You are an expert ATS (Applicant Tracking System) resume analyzer. Analyze this resume and return ONLY a valid JSON object with no extra text, no markdown, no backticks.

Resume:
${resumeText}

Return this exact JSON structure:
{
  "overallScore": <number 0-100>,
  "sections": {
    "impact": { "score": <0-100>, "feedback": "<one line>" },
    "brevity": { "score": <0-100>, "feedback": "<one line>" },
    "style": { "score": <0-100>, "feedback": "<one line>" },
    "skills": { "score": <0-100>, "feedback": "<one line>" },
    "completeness": { "score": <0-100>, "feedback": "<one line>" }
  },
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
  "missingKeywords": ["<keyword 1>", "<keyword 2>", "<keyword 3>", "<keyword 4>", "<keyword 5>"],
  "verdict": "<2 sentence overall verdict>"
}`;

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        setError(
          `Server error: ${errData?.error?.message || response.statusText}`,
        );
        setLoading(false);
        return;
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (err) {
      setError(
        "Could not connect to the local server. Make sure you ran: npm run server",
      );
    } finally {
      setLoading(false);
    }
  };

  const sectionLabels = {
    impact: "Impact",
    brevity: "Brevity",
    style: "Style",
    skills: "Skills",
    completeness: "Completeness",
  };

  const scoreColor = (s) =>
    s >= 75 ? "text-green-600" : s >= 50 ? "text-amber-500" : "text-red-500";
  const barColor = (s) =>
    s >= 75 ? "bg-green-500" : s >= 50 ? "bg-amber-400" : "bg-red-400";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                ATS Score Checker
              </h2>
              <p className="text-xs text-gray-400">Powered by Groq · Llama 3</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition text-lg"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5">
          {/* Analyze button */}
          {!result && !loading && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-violet-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                🎯
              </div>
              <p className="text-gray-500 text-sm mb-2 max-w-sm mx-auto">
                Get an AI-powered ATS analysis — scores, missing keywords, and
                actionable improvements.
              </p>
              <p className="text-xs text-emerald-600 font-medium mb-6">
                ✅ Free · Powered by Groq + Llama 3
              </p>
              <button
                onClick={analyzeResume}
                className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-3 rounded-xl transition shadow-lg shadow-violet-200 text-sm"
              >
                Analyze My Resume
              </button>
              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-xs text-center max-w-sm mx-auto">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mb-4" />
              <p className="text-gray-500 text-sm">
                Analyzing your resume with AI...
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Usually takes 3–5 seconds
              </p>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-5">
              {/* Overall score */}
              <div className="flex items-center gap-6 bg-gray-50 rounded-2xl p-5">
                <ScoreRing score={result.overallScore} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Overall ATS Score
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {result.verdict}
                  </p>
                </div>
              </div>

              {/* Section scores */}
              <div>
                <p className="text-sm font-bold text-gray-600 mb-3 uppercase tracking-wide">
                  Section Breakdown
                </p>
                <div className="space-y-3">
                  {Object.entries(result.sections).map(([key, val]) => (
                    <div key={key}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          {sectionLabels[key]}
                        </span>
                        <span
                          className={`text-sm font-bold ${scoreColor(val.score)}`}
                        >
                          {val.score}/100
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-700 ${barColor(val.score)}`}
                          style={{ width: `${val.score}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-400">{val.feedback}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-green-700 uppercase tracking-wide mb-2">
                    ✅ Strengths
                  </p>
                  <ul className="space-y-1.5">
                    {result.strengths?.map((s, i) => (
                      <li
                        key={i}
                        className="text-xs text-green-800 flex gap-1.5"
                      >
                        <span>•</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-amber-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-2">
                    ⚡ Improvements
                  </p>
                  <ul className="space-y-1.5">
                    {result.improvements?.map((s, i) => (
                      <li
                        key={i}
                        className="text-xs text-amber-800 flex gap-1.5"
                      >
                        <span>•</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Missing keywords */}
              {result.missingKeywords?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                    🔍 Suggested Keywords to Add
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {result.missingKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="bg-violet-50 text-violet-700 border border-violet-200 text-xs font-medium px-2.5 py-1 rounded-full"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Re-analyze */}
              <button
                onClick={analyzeResume}
                className="w-full py-2.5 rounded-xl border border-violet-200 text-violet-600 font-semibold text-sm hover:bg-violet-50 transition"
              >
                Re-analyze
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ATSScorer;
