import React, { useRef, useState, useEffect } from "react";

export function toDDMMYYYY(isoOrYmd?: string): string {
  if (!isoOrYmd) return "";
  const clean = isoOrYmd.includes("T") ? isoOrYmd.split("T")[0] : isoOrYmd;
  const parts = clean.split("-");
  if (parts.length === 3) {
    const [y, m, d] = parts;
    return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
  }
  return isoOrYmd;
}

export function toYYYYMMDD(ddmmyyyy?: string): string {
  if (!ddmmyyyy) return "";
  const parts = ddmmyyyy.split("/");
  if (parts.length === 3) {
    const [d, m, y] = parts;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  return ddmmyyyy;
}

interface DatePickerProps {
  value?: string; // YYYY-MM-DD
  onChange: (ymd: string) => void;
  className?: string;
  placeholder?: string;
  inputClassName?: string;
}

export function DatePickerDDMMYYYY({
  value,
  onChange,
  className = "",
  placeholder = "dd/mm/yyyy",
  inputClassName = "",
}: DatePickerProps) {
  const hiddenRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState(() => toDDMMYYYY(value));

  useEffect(() => {
    setText(toDDMMYYYY(value));
  }, [value]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setText(raw);
    const match = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (match) {
      const [, d, m, y] = match;
      const ymd = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
      onChange(ymd);
    }
  };

  const openPicker = () => {
    if (hiddenRef.current) {
      if (typeof hiddenRef.current.showPicker === "function") {
        try {
          hiddenRef.current.showPicker();
        } catch {
          hiddenRef.current.focus();
        }
      } else {
        hiddenRef.current.focus();
      }
    }
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <input
        type="text"
        value={text}
        onChange={handleTextChange}
        placeholder={placeholder}
        className={`w-full bg-[#fdfcf7] border border-[#d4a55a]/40 rounded-xl px-3.5 py-2.5 text-sm text-[#005a55] outline-none focus:border-[#005a55] focus:ring-2 focus:ring-[#005a55]/10 font-medium tracking-wide pr-9 ${inputClassName}`}
      />
      <button
        type="button"
        onClick={openPicker}
        className="absolute right-2.5 text-[#8c6218] hover:text-[#005a55] transition-colors p-1 cursor-pointer"
        title="Open calendar"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </button>
      <input
        ref={hiddenRef}
        type="date"
        value={value || ""}
        onChange={(e) => {
          if (e.target.value) {
            onChange(e.target.value);
            setText(toDDMMYYYY(e.target.value));
          }
        }}
        className="absolute opacity-0 pointer-events-none w-0 h-0"
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
}

export function InlineDatePickerDDMMYYYY({
  value,
  onChange,
}: {
  value?: string;
  onChange: (ymd: string) => void;
}) {
  const hiddenRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    if (hiddenRef.current) {
      if (typeof hiddenRef.current.showPicker === "function") {
        try {
          hiddenRef.current.showPicker();
        } catch {
          hiddenRef.current.focus();
        }
      } else {
        hiddenRef.current.focus();
      }
    }
  };

  const formatted = toDDMMYYYY(value) || "dd/mm/yyyy";

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={openPicker}
        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-[#d4a55a]/40 bg-white hover:border-[#005a55] hover:bg-[#F7F5EF] text-[11px] font-semibold text-[#005a55] transition-colors cursor-pointer"
        title="Click to change date (dd/mm/yyyy)"
      >
        <span>{formatted}</span>
        <svg
          className="w-3 h-3 text-[#8c6218]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </button>
      <input
        ref={hiddenRef}
        type="date"
        value={value || ""}
        onChange={(e) => {
          if (e.target.value) {
            onChange(e.target.value);
          }
        }}
        className="absolute opacity-0 pointer-events-none w-0 h-0"
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
}
