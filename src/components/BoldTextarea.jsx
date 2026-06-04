import { useRef } from "react";

function BoldTextarea({ value, onChange, rows = 3, placeholder, className }) {
  const ref = useRef();

  const applyBold = () => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    if (start === end) {
      const before = value.slice(0, start);
      const after = value.slice(end);
      const newVal = before + "****" + after;
      onChange({ target: { value: newVal } });
      requestAnimationFrame(() => {
        el.selectionStart = start + 2;
        el.selectionEnd = start + 2;
        el.focus();
      });
      return;
    }
    const selected = value.slice(start, end);
    if (selected.startsWith("**") && selected.endsWith("**") && selected.length > 4) {
      const unwrapped = selected.slice(2, -2);
      const newVal = value.slice(0, start) + unwrapped + value.slice(end);
      onChange({ target: { value: newVal } });
      requestAnimationFrame(() => {
        el.selectionStart = start;
        el.selectionEnd = start + unwrapped.length;
        el.focus();
      });
    } else {
      const wrapped = `**${selected}**`;
      const newVal = value.slice(0, start) + wrapped + value.slice(end);
      onChange({ target: { value: newVal } });
      requestAnimationFrame(() => {
        el.selectionStart = start;
        el.selectionEnd = start + wrapped.length;
        el.focus();
      });
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "b") {
      e.preventDefault();
      applyBold();
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-1 mb-1">
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); applyBold(); }}
          className="w-6 h-6 flex items-center justify-center rounded border border-gray-300 bg-white text-gray-700 font-bold text-xs hover:bg-gray-100 hover:border-gray-400 transition select-none"
          title="Bold selected text (Ctrl+B)"
        >
          B
        </button>
        <span className="text-xs text-gray-400">Select text → click B, or Ctrl+B</span>
      </div>
      <textarea
        ref={ref}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        className={className}
      />
    </div>
  );
}

export default BoldTextarea;
