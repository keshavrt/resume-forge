import { useState, useEffect, useRef } from "react";
import Form from "./components/Form";
import Preview from "./components/Preview";
import ATSScorer from "./components/ATSScorer";

const EMPTY_RESUME = {
  name: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  registrationNo: "",
  summary: "",
  experience: [{ company: "", role: "", duration: "", description: "" }],
  education: [{ school: "", degree: "", year: "", cgpa: "" }],
  skillRows: [{ label: "", value: "" }],
  projects: [{ name: "", tech: "", duration: "", description: "" }],
  achievements: "",
  positions: [{ role: "", org: "", duration: "", description: "" }],
  references: [{ name: "", designation: "", institution: "", email: "", phone: "" }],
};

const STORAGE_KEY = "resumeforge_data";

export default function App() {
  const [resumeData, setResumeData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...EMPTY_RESUME, ...JSON.parse(saved) } : EMPTY_RESUME;
    } catch {
      return EMPTY_RESUME;
    }
  });

  const [verified, setVerified] = useState(false);
  const [activeTab, setActiveTab] = useState("form");
  const [showATS, setShowATS] = useState(false);
  const [saveIndicator, setSaveIndicator] = useState(false);
  const importRef = useRef();

  // Auto-save to localStorage whenever resumeData changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
      setSaveIndicator(true);
      const t = setTimeout(() => setSaveIndicator(false), 1500);
      return () => clearTimeout(t);
    } catch {}
  }, [resumeData]);

  // JSON Export
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(resumeData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resumeData.name || "resume"}_data.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // JSON Import
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        setResumeData({ ...EMPTY_RESUME, ...parsed });
      } catch {
        alert("Invalid JSON file. Please export a valid resume file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // Reset
  const handleReset = () => {
    if (window.confirm("Clear all resume data? This cannot be undone.")) {
      setResumeData(EMPTY_RESUME);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-3 px-6 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📄</span>
          <div>
            <h1 className="text-xl font-bold tracking-tight leading-none">ResumeForge</h1>
            <p className="text-slate-400 text-xs mt-0.5">IIT-style resume builder</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* Auto-save indicator */}
          <span className={`text-xs transition-opacity duration-500 ${saveIndicator ? "opacity-100 text-emerald-400" : "opacity-0"}`}>
            ✓ Saved
          </span>

          {/* Mobile tab switcher */}
          <div className="flex md:hidden rounded-lg overflow-hidden border border-slate-600">
            <button onClick={() => setActiveTab("form")} className={`px-3 py-1.5 text-sm font-medium transition ${activeTab === "form" ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-300"}`}>Edit</button>
            <button onClick={() => setActiveTab("preview")} className={`px-3 py-1.5 text-sm font-medium transition ${activeTab === "preview" ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-300"}`}>Preview</button>
          </div>

          {/* ATS Score button */}
          <button
            onClick={() => setShowATS(true)}
            className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white transition flex items-center gap-1.5"
          >
            <span>🎯</span> ATS Score
          </button>

          {/* Import */}
          <input ref={importRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
          <button
            onClick={() => importRef.current.click()}
            className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 transition"
            title="Import resume from JSON"
          >
            ⬆ Import
          </button>

          {/* Export */}
          <button
            onClick={handleExport}
            className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 transition"
            title="Export resume as JSON"
          >
            ⬇ Export
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-slate-700 hover:bg-slate-600 text-red-400 border border-slate-600 transition"
            title="Clear all data"
          >
            ✕ Reset
          </button>

          {/* Verified */}
          <button
            onClick={() => setVerified(!verified)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition border-2 ${
              verified ? "bg-emerald-500 border-emerald-400 text-white" : "bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600"
            }`}
          >
            {verified ? "✔ Verified" : "○ Mark as Verified"}
          </button>
        </div>
      </div>

      {/* Split panel */}
      <div className="flex h-[calc(100vh-56px)]">
        {/* Form panel */}
        <div className={`${activeTab === "preview" ? "hidden" : "flex"} md:flex w-full md:w-1/2 overflow-y-auto flex-col bg-white border-r border-slate-200`}>
          <div className="p-5">
            <Form resumeData={resumeData} setResumeData={setResumeData} />
          </div>
        </div>

        {/* Preview panel */}
        <div className={`${activeTab === "form" ? "hidden" : "flex"} md:flex w-full md:w-1/2 overflow-y-auto flex-col bg-slate-50 p-5`}>
          <Preview resumeData={resumeData} verified={verified} />
        </div>
      </div>

      {/* ATS Modal */}
      {showATS && (
        <ATSScorer resumeData={resumeData} onClose={() => setShowATS(false)} />
      )}
    </div>
  );
}
