import BoldTextarea from "./BoldTextarea";

function Form({ resumeData, setResumeData }) {
  const update = (field, value) => setResumeData((prev) => ({ ...prev, [field]: value }));

  const updateArr = (key, index, field, value) => {
    const updated = [...resumeData[key]];
    updated[index][field] = value;
    setResumeData((prev) => ({ ...prev, [key]: updated }));
  };

  const addItem = (key, empty) =>
    setResumeData((prev) => ({ ...prev, [key]: [...prev[key], empty] }));

  const removeItem = (key, index) =>
    setResumeData((prev) => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) }));

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white";
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1";
  const sectionClass = "mb-6";
  const headingClass = "text-sm font-bold text-blue-600 uppercase tracking-widest mb-3 border-b border-blue-100 pb-1 flex items-center gap-2";
  const cardClass = "bg-gray-50 rounded-lg p-3 mb-3 border border-gray-100";

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-700 mb-5">Fill Your Details</h2>

      {/* ── Personal Info ── */}
      <div className={sectionClass}>
        <p className={headingClass}><span>👤</span> Personal Info</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Full Name</label>
            <input className={inputClass} placeholder="Jane Smith" value={resumeData.name} onChange={(e) => update("name", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Job Title / Programme</label>
            <input className={inputClass} placeholder="B.Tech Computer Science" value={resumeData.title} onChange={(e) => update("title", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Registration No.</label>
            <input className={inputClass} placeholder="B.Tech./CS/XXXXX/20XX" value={resumeData.registrationNo} onChange={(e) => update("registrationNo", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input className={inputClass} placeholder="+91 XXXXX XXXXX" value={resumeData.phone} onChange={(e) => update("phone", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input className={inputClass} placeholder="jane@email.com" value={resumeData.email} onChange={(e) => update("email", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <input className={inputClass} placeholder="City, Country" value={resumeData.location} onChange={(e) => update("location", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>LinkedIn URL</label>
            <input className={inputClass} placeholder="linkedin.com/in/username" value={resumeData.linkedin || ""} onChange={(e) => update("linkedin", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>GitHub URL</label>
            <input className={inputClass} placeholder="github.com/username" value={resumeData.github || ""} onChange={(e) => update("github", e.target.value)} />
          </div>
        </div>
      </div>

      {/* ── Area of Interest ── */}
      <div className={sectionClass}>
        <p className={headingClass}><span>🎯</span> Area of Interest / Summary</p>
        <textarea
          className={inputClass}
          rows={3}
          placeholder="e.g. Competitive Programming, Data Structures, Web Development..."
          value={resumeData.summary}
          onChange={(e) => update("summary", e.target.value)}
        />
      </div>

      {/* ── Education ── */}
      <div className={sectionClass}>
        <p className={headingClass}><span>🎓</span> Education</p>
        {resumeData.education.map((edu, i) => (
          <div key={i} className={cardClass}>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={labelClass}>Degree / Examination</label>
                <input className={inputClass} placeholder="B.Tech / Class XII / Class X" value={edu.degree} onChange={(e) => updateArr("education", i, "degree", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Institution / Board</label>
                <input className={inputClass} placeholder="University / School Name" value={edu.school} onChange={(e) => updateArr("education", i, "school", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Year</label>
                <input className={inputClass} placeholder="20XX – 20XX" value={edu.year} onChange={(e) => updateArr("education", i, "year", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>CGPA / %</label>
                <input className={inputClass} placeholder="X.X / XX%" value={edu.cgpa} onChange={(e) => updateArr("education", i, "cgpa", e.target.value)} />
              </div>
            </div>
            {resumeData.education.length > 1 && (
              <button onClick={() => removeItem("education", i)} className="text-xs text-red-400 hover:text-red-600 mt-2">− Remove</button>
            )}
          </div>
        ))}
        <button onClick={() => addItem("education", { school: "", degree: "", year: "", cgpa: "" })} className="text-sm text-blue-500 hover:text-blue-700 font-medium">
          + Add Education
        </button>
      </div>

      {/* ── Internships ── */}
      <div className={sectionClass}>
        <p className={headingClass}><span>💼</span> Internships / Experience</p>
        {resumeData.experience.map((exp, i) => (
          <div key={i} className={cardClass}>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className={labelClass}>Role</label>
                <input className={inputClass} placeholder="Software Engineer Intern" value={exp.role} onChange={(e) => updateArr("experience", i, "role", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Company / Organisation</label>
                <input className={inputClass} placeholder="Company Name" value={exp.company} onChange={(e) => updateArr("experience", i, "company", e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Duration</label>
                <input className={inputClass} placeholder="Jan 20XX – May 20XX" value={exp.duration} onChange={(e) => updateArr("experience", i, "duration", e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Description (one point per line)</label>
                <BoldTextarea
                  className={inputClass}
                  rows={3}
                  placeholder={"Worked on X to achieve Y\nImproved Z by N%"}
                  value={exp.description}
                  onChange={(e) => updateArr("experience", i, "description", e.target.value)}
                />
              </div>
            </div>
            {resumeData.experience.length > 1 && (
              <button onClick={() => removeItem("experience", i)} className="text-xs text-red-400 hover:text-red-600">− Remove</button>
            )}
          </div>
        ))}
        <button onClick={() => addItem("experience", { company: "", role: "", duration: "", description: "" })} className="text-sm text-blue-500 hover:text-blue-700 font-medium">
          + Add Experience
        </button>
      </div>

      {/* ── Projects ── */}
      <div className={sectionClass}>
        <p className={headingClass}><span>🚀</span> Projects</p>
        {resumeData.projects.map((proj, i) => (
          <div key={i} className={cardClass}>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className={labelClass}>Project Name</label>
                <input className={inputClass} placeholder="Project Title" value={proj.name} onChange={(e) => updateArr("projects", i, "name", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Tech / Tag</label>
                <input className={inputClass} placeholder="React, Node.js, Python..." value={proj.tech} onChange={(e) => updateArr("projects", i, "tech", e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Duration</label>
                <input className={inputClass} placeholder="Jan 20XX – Feb 20XX" value={proj.duration} onChange={(e) => updateArr("projects", i, "duration", e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Description (one point per line)</label>
                <BoldTextarea
                  className={inputClass}
                  rows={3}
                  placeholder={"Brief description of what you built\nKey features or outcomes"}
                  value={proj.description}
                  onChange={(e) => updateArr("projects", i, "description", e.target.value)}
                />
              </div>
            </div>
            {resumeData.projects.length > 1 && (
              <button onClick={() => removeItem("projects", i)} className="text-xs text-red-400 hover:text-red-600">− Remove</button>
            )}
          </div>
        ))}
        <button onClick={() => addItem("projects", { name: "", tech: "", duration: "", description: "" })} className="text-sm text-blue-500 hover:text-blue-700 font-medium">
          + Add Project
        </button>
      </div>

      {/* ── Achievements ── */}
      <div className={sectionClass}>
        <p className={headingClass}><span>🏆</span> Awards / Achievements</p>
        <p className="text-xs text-gray-400 mb-2">One achievement per line</p>
        <textarea
          className={inputClass}
          rows={5}
          placeholder={"AIR xxx in JEE Advanced 202x"}
          value={resumeData.achievements}
          onChange={(e) => update("achievements", e.target.value)}
        />
      </div>

      {/* ── Skills ── */}
      <div className={sectionClass}>
        <p className={headingClass}><span>🛠</span> Technical Skills</p>
        {resumeData.skillRows?.map((row, i) => (
          <div key={i} className="flex gap-2 mb-2 items-end">
            <div className="w-2/5">
              {i === 0 && <label className={labelClass}>Category</label>}
              <input
                className={inputClass}
                placeholder="e.g. Programming Languages"
                value={row.label}
                onChange={(e) => updateArr("skillRows", i, "label", e.target.value)}
              />
            </div>
            <div className="flex-1">
              {i === 0 && <label className={labelClass}>Skills</label>}
              <input
                className={inputClass}
                placeholder="e.g. C++, Python, Java"
                value={row.value}
                onChange={(e) => updateArr("skillRows", i, "value", e.target.value)}
              />
            </div>
            {resumeData.skillRows.length > 1 && (
              <button onClick={() => removeItem("skillRows", i)} className="text-xs text-red-400 hover:text-red-600 pb-2">✕</button>
            )}
          </div>
        ))}
        <button onClick={() => addItem("skillRows", { label: "", value: "" })} className="text-sm text-blue-500 hover:text-blue-700 font-medium">
          + Add Skill Row
        </button>
      </div>

      {/* ── Positions of Responsibility ── */}
      <div className={sectionClass}>
        <p className={headingClass}><span>📌</span> Positions of Responsibility & Extra Curriculars</p>
        {resumeData.positions?.map((pos, i) => (
          <div key={i} className={cardClass}>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className={labelClass}>Role / Title</label>
                <input className={inputClass} placeholder="e.g. Secretary / Coordinator" value={pos.role} onChange={(e) => updateArr("positions", i, "role", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Organisation</label>
                <input className={inputClass} placeholder="e.g. Club / Society Name" value={pos.org} onChange={(e) => updateArr("positions", i, "org", e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Duration</label>
                <input className={inputClass} placeholder="Aug 20XX – Present" value={pos.duration} onChange={(e) => updateArr("positions", i, "duration", e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Description (one point per line)</label>
                <BoldTextarea
                  className={inputClass}
                  rows={3}
                  placeholder={"Key responsibilities in the role\nEvents organised or outcomes achieved"}
                  value={pos.description}
                  onChange={(e) => updateArr("positions", i, "description", e.target.value)}
                />
              </div>
            </div>
            {resumeData.positions.length > 1 && (
              <button onClick={() => removeItem("positions", i)} className="text-xs text-red-400 hover:text-red-600">− Remove</button>
            )}
          </div>
        ))}
        <button onClick={() => addItem("positions", { role: "", org: "", duration: "", description: "" })} className="text-sm text-blue-500 hover:text-blue-700 font-medium">
          + Add Position
        </button>
      </div>

      {/* ── References ── */}
      <div className={sectionClass}>
        <p className={headingClass}><span>📎</span> References</p>
        {resumeData.references?.map((ref, i) => (
          <div key={i} className={cardClass}>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={labelClass}>Name</label>
                <input className={inputClass} placeholder="Prof. / Dr. Full Name" value={ref.name} onChange={(e) => updateArr("references", i, "name", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Designation</label>
                <input className={inputClass} placeholder="Professor / Manager" value={ref.designation} onChange={(e) => updateArr("references", i, "designation", e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Institution</label>
                <input className={inputClass} placeholder="Dept. of X, University Name" value={ref.institution} onChange={(e) => updateArr("references", i, "institution", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input className={inputClass} placeholder="name@university.edu" value={ref.email} onChange={(e) => updateArr("references", i, "email", e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input className={inputClass} placeholder="+91 XXXXX XXXXX" value={ref.phone} onChange={(e) => updateArr("references", i, "phone", e.target.value)} />
              </div>
            </div>
            {resumeData.references.length > 1 && (
              <button onClick={() => removeItem("references", i)} className="text-xs text-red-400 hover:text-red-600 mt-2">− Remove</button>
            )}
          </div>
        ))}
        <button onClick={() => addItem("references", { name: "", designation: "", institution: "", email: "", phone: "" })} className="text-sm text-blue-500 hover:text-blue-700 font-medium">
          + Add Reference
        </button>
      </div>
    </div>
  );
}

export default Form;
