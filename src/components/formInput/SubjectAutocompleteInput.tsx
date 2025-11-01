import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils"; // ถ้ามี
type Subject = { subjectId: string; subjectName: string };

interface Props {
  value: string;
  subjects: Subject[];
  onChange: (subjectId: string, subjectName: string) => void;
  error?: string;
  placeholder?: string;
}

export default function SubjectAutocompleteInput({
  value,
  subjects,
  onChange,
  error,
  placeholder = "เช่น 02739200",
}: Props) {
  const [inputValue, setInputValue] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setInputValue(value); }, [value]);

  // Filter subjects by input
  const filtered = inputValue
    ? subjects.filter(
        (item) =>
          item.subjectId.includes(inputValue) ||
          item.subjectName.toLowerCase().includes(inputValue.toLowerCase())
      )
    : [];

  // Close dropdown when click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        setHighlight(-1);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <Input
        value={inputValue}
        placeholder={placeholder}
        onChange={e => {
          setInputValue(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        onKeyDown={e => {
          if (!showSuggestions) return;
          if (e.key === "ArrowDown") {
            setHighlight((h) => Math.min(h + 1, filtered.length - 1));
          } else if (e.key === "ArrowUp") {
            setHighlight((h) => Math.max(h - 1, 0));
          } else if (e.key === "Enter" && highlight >= 0 && filtered[highlight]) {
            const item = filtered[highlight];
            setInputValue(item.subjectId);
            onChange(item.subjectId, item.subjectName);
            setShowSuggestions(false);
            setHighlight(-1);
          }
        }}
        className={cn("mt-1 bg-white shadow-md", error && "border-red-500")}
      />
      {showSuggestions && filtered.length > 0 && (
        <ul className="absolute z-10 mt-2 w-full bg-white rounded shadow max-h-48 overflow-auto">
          {filtered.map((item, idx) => (
            <li
              key={item.subjectId}
              className={cn(
                "px-3 py-2  cursor-pointer hover:bg-gray-100 text-md",
                highlight === idx && "bg-gray-200"
              )}
              onMouseDown={() => {
                setInputValue(item.subjectId);
                onChange(item.subjectId, item.subjectName);
                setShowSuggestions(false);
                setHighlight(-1);
              }}
              onMouseEnter={() => setHighlight(idx)}
            >
              {item.subjectId} - {item.subjectName}
            </li>
          ))}
        </ul>
      )}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}