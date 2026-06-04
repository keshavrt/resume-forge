import { useRef, useEffect, useState } from "react";
import { useReactToPrint } from "react-to-print";

const IITR_LOGO =
  "data:image/png;base64,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";

/* ── Inline bold renderer ── */
function RichText({ text }) {
  if (!text) return null;
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <span>
      {parts.map((part, i) =>
        i % 2 === 1 ? <strong key={i}>{part}</strong> : part,
      )}
    </span>
  );
}

/* ── Verified stamp — green border box matching the screenshot ── */
function VerifiedStamp() {
  return (
    <div
      style={{
        display: "inline-block",
        border: "2.5px solid #16a34a",
        padding: "3px 10px",
        backgroundColor: "white",
      }}
    >
      <p
        style={{
          fontSize: "13px",
          fontWeight: "900",
          color: "#16a34a",
          margin: 0,
          letterSpacing: "2.5px",
          textTransform: "uppercase",
          fontFamily: "Arial, sans-serif",
        }}
      >
        VERIFIED
      </p>
    </div>
  );
}

/* ── Section divider ── */
function SectionDivider({ title }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        margin: "15px 0 7px 0",
      }}
    >
      <div
        style={{
          width: "160px",
          height: "2px",
          backgroundColor: "#222",
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: "14px",
          fontWeight: "700",
          letterSpacing: "0.5px",
          whiteSpace: "nowrap",
          color: "#111",
        }}
      >
        {title}
      </span>
    </div>
  );
}

/* ── Main resume template ── */
function ResumeTemplate({ data, verified }) {
  const bullet = {
    fontSize: "12.5px",
    color: "#1a1a1a",
    lineHeight: "1.85",
    marginBottom: "2px",
    paddingLeft: "0px",
  };

  const hasAny = (arr) => arr?.some((x) => Object.values(x).some(Boolean));

  const logoSrc = IITR_LOGO;
  const instName = "Indian Institute of\nTechnology\nRoorkee";

  return (
    <div
      style={{
        fontFamily: "'Times New Roman', Times, serif",
        width: "210mm",
        minHeight: "297mm",
        padding: "14mm 18mm 18mm 18mm",
        boxSizing: "border-box",
        backgroundColor: "white",
        color: "#111",
        position: "relative",
      }}
    >
      {/* ── Header: name+contact LEFT | institution block RIGHT ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "10px",
        }}
      >
        {/* Left: name + contact details */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: "900",
              margin: "0 0 5px 0",
              letterSpacing: "0.5px",
              fontFamily: "Arial, sans-serif",
              textTransform: "uppercase",
            }}
          >
            {data.name || "YOUR FULL NAME"}
          </h1>
          {data.title && (
            <p style={{ fontSize: "13px", margin: "0 0 2px 0", color: "#222" }}>
              {data.title}
            </p>
          )}
          {data.registrationNo && (
            <p
              style={{ fontSize: "12.5px", margin: "0 0 2px 0", color: "#333" }}
            >
              Registration No: {data.registrationNo}
            </p>
          )}
          {data.phone && (
            <p
              style={{ fontSize: "12.5px", margin: "0 0 2px 0", color: "#333" }}
            >
              Contact No: {data.phone}
            </p>
          )}
          {data.email && (
            <p
              style={{ fontSize: "12.5px", margin: "0 0 2px 0", color: "#333" }}
            >
              Email: {data.email}
            </p>
          )}
          {data.location && (
            <p
              style={{ fontSize: "12.5px", margin: "0 0 2px 0", color: "#333" }}
            >
              {data.location}
            </p>
          )}
          {(data.linkedin || data.github) && (
            <p
              style={{ fontSize: "12.5px", margin: "0 0 2px 0", color: "#333" }}
            >
              {data.linkedin && (
                <a
                  href={
                    data.linkedin.startsWith("http")
                      ? data.linkedin
                      : `https://${data.linkedin}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#1a1a1a", textDecoration: "underline" }}
                >
                  LinkedIn
                </a>
              )}
              {data.linkedin && data.github && ", "}
              {data.github && (
                <a
                  href={
                    data.github.startsWith("http")
                      ? data.github
                      : `https://${data.github}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#1a1a1a", textDecoration: "underline" }}
                >
                  GitHub
                </a>
              )}
            </p>
          )}
        </div>

        {/* Right: institution name LEFT of logo, verified stamp centered below */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginLeft: "20px",
            flexShrink: 0,
          }}
        >
          {/* Top row: text to the left, logo to the right */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <p
              style={{
                fontSize: "12px",
                fontWeight: "500",
                color: "#111",
                margin: 0,
                lineHeight: "1.6",
                textAlign: "right",
                whiteSpace: "pre-line",
                fontFamily: "Arial, sans-serif",
              }}
            >
              {instName}
            </p>
            <img
              src={logoSrc}
              alt="IITR logo"
              style={{
                width: "72px",
                height: "72px",
                objectFit: "contain",
                flexShrink: 0,
              }}
            />
          </div>
          {/* Verified stamp below, only when verified */}
          {verified && (
            <div style={{ marginTop: "6px" }}>
              <VerifiedStamp />
            </div>
          )}
        </div>
      </div>

      {/* ── Area of Interest ── */}
      {data.summary && (
        <>
          <SectionDivider title="Area of Interest" />
          <p
            style={{
              fontSize: "12.5px",
              color: "#1a1a1a",
              lineHeight: "1.85",
              margin: "0 0 4px 0",
            }}
          >
            {data.summary}
          </p>
        </>
      )}

      {/* ── Education ── */}
      {data.education?.some((e) => e.school || e.degree) && (
        <>
          <SectionDivider title="Education" />
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "12.5px",
              marginBottom: "4px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f4f4f4" }}>
                {[
                  "Year",
                  "Degree / Examination",
                  "Institution / Board",
                  "CGPA / Percentage",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      border: "1px solid #bbb",
                      padding: "6px 9px",
                      textAlign: "left",
                      fontWeight: "700",
                      fontFamily: "Arial, sans-serif",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.education.map((edu, i) =>
                edu.school || edu.degree ? (
                  <tr key={i}>
                    <td
                      style={{ border: "1px solid #bbb", padding: "6px 9px" }}
                    >
                      {edu.year}
                    </td>
                    <td
                      style={{ border: "1px solid #bbb", padding: "6px 9px" }}
                    >
                      {edu.degree}
                    </td>
                    <td
                      style={{ border: "1px solid #bbb", padding: "6px 9px" }}
                    >
                      {edu.school}
                    </td>
                    <td
                      style={{
                        border: "1px solid #bbb",
                        padding: "6px 9px",
                        fontStyle: "italic",
                      }}
                    >
                      {edu.cgpa}
                    </td>
                  </tr>
                ) : null,
              )}
            </tbody>
          </table>
        </>
      )}

      {/* ── Internships ── */}
      {hasAny(data.experience) && (
        <>
          <SectionDivider title="Internships" />
          {data.experience.map((exp, i) =>
            exp.company || exp.role ? (
              <div key={i} style={{ marginBottom: "12px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: "700",
                      margin: "0 0 3px 0",
                      fontFamily: "Arial, sans-serif",
                    }}
                  >
                    <RichText text={exp.role} />
                    {exp.company && (
                      <span style={{ fontWeight: "400" }}>
                        {" "}
                        | {exp.company}
                      </span>
                    )}
                  </p>
                  {exp.duration && (
                    <p
                      style={{
                        fontSize: "12.5px",
                        color: "#444",
                        whiteSpace: "nowrap",
                        marginLeft: "10px",
                        margin: 0,
                      }}
                    >
                      {exp.duration}
                    </p>
                  )}
                </div>
                {exp.description &&
                  exp.description
                    .split("\n")
                    .filter(Boolean)
                    .map((point, j) => (
                      <p key={j} style={bullet}>
                        • <RichText text={point} />
                      </p>
                    ))}
              </div>
            ) : null,
          )}
        </>
      )}

      {/* ── Projects ── */}
      {hasAny(data.projects) && (
        <>
          <SectionDivider title="Projects" />
          {data.projects.map((proj, i) =>
            proj.name ? (
              <div key={i} style={{ marginBottom: "12px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: "700",
                      margin: "0 0 3px 0",
                      fontFamily: "Arial, sans-serif",
                    }}
                  >
                    <RichText text={proj.name} />
                    {proj.tech && (
                      <span style={{ fontWeight: "400" }}> | {proj.tech}</span>
                    )}
                  </p>
                  {proj.duration && (
                    <p
                      style={{
                        fontSize: "12.5px",
                        color: "#444",
                        whiteSpace: "nowrap",
                        marginLeft: "10px",
                        margin: 0,
                      }}
                    >
                      {proj.duration}
                    </p>
                  )}
                </div>
                {proj.description &&
                  proj.description
                    .split("\n")
                    .filter(Boolean)
                    .map((point, j) => (
                      <p key={j} style={bullet}>
                        • <RichText text={point} />
                      </p>
                    ))}
              </div>
            ) : null,
          )}
        </>
      )}

      {/* ── Achievements ── */}
      {data.achievements && (
        <>
          <SectionDivider title="Awards / Scholarships / Academic Achievements" />
          {data.achievements
            .split("\n")
            .filter(Boolean)
            .map((item, i) => (
              <p key={i} style={bullet}>
                • <RichText text={item} />
              </p>
            ))}
        </>
      )}

      {/* ── Skills ── */}
      {data.skillRows?.some((r) => r.label || r.value) && (
        <>
          <SectionDivider title="Skills" />
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "12.5px",
              marginBottom: "4px",
            }}
          >
            <tbody>
              {data.skillRows.map((row, i) =>
                row.label || row.value ? (
                  <tr key={i}>
                    <td
                      style={{
                        padding: "3px 10px 3px 0",
                        fontWeight: "700",
                        whiteSpace: "nowrap",
                        verticalAlign: "top",
                        width: "220px",
                        fontFamily: "Arial, sans-serif",
                      }}
                    >
                      {row.label}
                    </td>
                    <td
                      style={{
                        padding: "3px 0",
                        color: "#1a1a1a",
                        lineHeight: "1.7",
                      }}
                    >
                      {row.value}
                    </td>
                  </tr>
                ) : null,
              )}
            </tbody>
          </table>
        </>
      )}

      {/* ── Positions of Responsibility ── */}
      {hasAny(data.positions) && (
        <>
          <SectionDivider title="Positions of Responsibility & Extra Curriculars" />
          {data.positions.map((pos, i) =>
            pos.role ? (
              <div key={i} style={{ marginBottom: "12px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: "700",
                      margin: "0 0 3px 0",
                      fontFamily: "Arial, sans-serif",
                    }}
                  >
                    <RichText text={pos.role} />
                    {pos.org && (
                      <span style={{ fontWeight: "400" }}> | {pos.org}</span>
                    )}
                  </p>
                  {pos.duration && (
                    <p
                      style={{
                        fontSize: "12.5px",
                        color: "#444",
                        whiteSpace: "nowrap",
                        marginLeft: "10px",
                        margin: 0,
                      }}
                    >
                      {pos.duration}
                    </p>
                  )}
                </div>
                {pos.description &&
                  pos.description
                    .split("\n")
                    .filter(Boolean)
                    .map((point, j) => (
                      <p key={j} style={bullet}>
                        • <RichText text={point} />
                      </p>
                    ))}
              </div>
            ) : null,
          )}
        </>
      )}

      {/* ── References ── */}
      {data.references?.some((r) => r.name) && (
        <>
          <SectionDivider title="References" />
          <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
            {data.references.map((ref, i) =>
              ref.name ? (
                <div key={i} style={{ fontSize: "12px", lineHeight: "1.8" }}>
                  <p
                    style={{
                      fontWeight: "700",
                      margin: "0 0 2px 0",
                      fontSize: "13px",
                      fontFamily: "Arial, sans-serif",
                    }}
                  >
                    {ref.name}
                  </p>
                  {ref.designation && (
                    <p style={{ margin: 0, color: "#333" }}>
                      {ref.designation}
                    </p>
                  )}
                  {ref.institution && (
                    <p style={{ margin: 0, color: "#333" }}>
                      {ref.institution}
                    </p>
                  )}
                  {ref.email && (
                    <p style={{ margin: 0, color: "#555" }}>{ref.email}</p>
                  )}
                  {ref.phone && (
                    <p style={{ margin: 0, color: "#555" }}>{ref.phone}</p>
                  )}
                </div>
              ) : null,
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Preview wrapper ── */
function Preview({ resumeData, verified }) {
  const printRef = useRef();
  const containerRef = useRef();
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const recalc = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth - 2;
        setScale(w / 794);
      }
    };
    recalc();
    const ro = new ResizeObserver(recalc);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${resumeData.name || "Resume"}_Resume`,
    pageStyle: `
      @page { size: A4; margin: 0; }
      @media print {
        html, body { width: 210mm; height: 297mm; }
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    `,
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold text-gray-600 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Live Preview
          {verified && (
            <span className="text-emerald-600 text-xs font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              ✔ Verified
            </span>
          )}
        </h2>
        <button
          onClick={handlePrint}
          className="bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow transition flex items-center gap-2"
        >
          <span>⬇</span> Download PDF
        </button>
      </div>

      <div ref={containerRef} style={{ width: "100%" }}>
        <div
          style={{
            width: `${794 * scale}px`,
            height: `${1123 * scale}px`,
            overflow: "hidden",
            borderRadius: "6px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.13)",
            border: "1px solid #e0e0e0",
          }}
        >
          <div
            style={{
              width: "794px",
              transformOrigin: "top left",
              transform: `scale(${scale})`,
            }}
          >
            <div ref={printRef}>
              <ResumeTemplate data={resumeData} verified={verified} />
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-3 text-center">
        A4 · 210 × 297 mm · Print-ready
      </p>
    </div>
  );
}

export default Preview;
