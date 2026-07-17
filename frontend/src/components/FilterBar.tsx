"use client";

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  tag: string;
  onTagChange: (value: string) => void;
  overdueOnly: boolean;
  onOverdueToggle: () => void;
  availableTags: string[];
}

export default function FilterBar({
  search,
  onSearchChange,
  tag,
  onTagChange,
  overdueOnly,
  onOverdueToggle,
  availableTags,
}: FilterBarProps) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 pb-6 pt-2 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 items-center gap-3">
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search tasks"
          className="focus-ring w-full max-w-xs rounded-md border border-ink-line bg-ink-raised px-3 py-2 text-sm text-paper placeholder:text-paper-dim md:w-64"
        />

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onTagChange("")}
            className={`focus-ring rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-wide transition ${
              tag === ""
                ? "border-teal bg-teal/10 text-teal"
                : "border-ink-line text-paper-dim hover:border-teal/60"
            }`}
          >
            All tags
          </button>
          {availableTags.map((t) => (
            <button
              key={t}
              onClick={() => onTagChange(t)}
              className={`focus-ring rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-wide transition ${
                tag === t
                  ? "border-teal bg-teal/10 text-teal"
                  : "border-ink-line text-paper-dim hover:border-teal/60"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onOverdueToggle}
        className={`focus-ring flex items-center gap-2 rounded-md border px-4 py-2 font-mono text-xs uppercase tracking-wide transition ${
          overdueOnly
            ? "border-crimson bg-crimson/10 text-crimson"
            : "border-ink-line text-paper-dim hover:border-crimson/60"
        }`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${overdueOnly ? "bg-crimson" : "bg-paper-dim"}`} />
        Overdue only
      </button>
    </div>
  );
}