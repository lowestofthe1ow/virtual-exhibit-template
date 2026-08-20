import { useState, useEffect, type ChangeEvent, type KeyboardEvent } from "react";

interface CommandInputProps {
  defaultValue?: string;
  onSubmit: (value: string) => void;
  /** When set, forces the input field to this value (e.g. clicking a hint) */
  inject?: string;
}

export default function CommandInput({ defaultValue = "", onSubmit, inject }: CommandInputProps) {
  const [draft, setDraft] = useState(defaultValue);
 
  useEffect(() => {
    if (inject !== undefined) setDraft(inject);
  }, [inject]);
 
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setDraft(e.target.value);
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSubmit(draft);
  };
 
  return (
    <label className="flex w-full items-center gap-2 rounded-full border border-red-600 bg-black px-8 py-2 font-mono text-red-500 focus-within:ring-2 focus-within:ring-red-500/50">
      <span aria-hidden="true">{">"}</span>
      <input
        type="text"
        value={draft}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="help"
        spellCheck={false}
        autoComplete="off"
        aria-label="Terminal command (press Enter to run)"
        className="min-w-0 flex-1 bg-black text-red-500 placeholder:text-red-500/50 outline-none"
      />
    </label>
  );
}
