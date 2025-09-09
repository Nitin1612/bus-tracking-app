// src/components/StopTags.jsx
import React, { useMemo, useState, useRef } from "react";

/**
 * StopTags (fixed - no nested <button>)
 *
 * Props:
 * - stops: Array of stop objects { id, name, lat, lon, buses: [...] }
 * - onSelect: function(stop) called when a tag is clicked/selected
 * - selectedStopName: optional string name of currently selected stop
 * - initialCount: number of tags to show when collapsed (default 10)
 */

export default function StopTags({
  stops = [],
  onSelect = () => {},
  handleSelect = () => {},
  selectedStopName = null,
  initialCount = 10,
  show = false,
}) {
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef(null);

  // Sort stops: most-served first (by number of buses), then alphabetically
  const sorted = useMemo(() => {
    return (stops || []).slice().sort((a, b) => {
      const la = (a.buses || []).length;
      const lb = (b.buses || []).length;
      if (la !== lb) return lb - la;
      return (a.name || "").localeCompare(b.name || "");
    });
  }, [stops]);

  // Filter by query if present
  const filtered = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter((s) => (s.name || "").toLowerCase().includes(q));
  }, [sorted, query]);

  const shown = expanded ? filtered : filtered.slice(0, initialCount);

  const highlight = (name) => {
    const q = (query || "").trim();
    if (!q) return name;
    const idx = (name || "").toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return name;
    return (
      <>
        {name.slice(0, idx)}
        <span className="bg-yellow-200 rounded px-1">
          {name.slice(idx, idx + q.length)}
        </span>
        {name.slice(idx + q.length)}
      </>
    );
  };

  const handleCopy = async (stop) => {
    try {
      await navigator.clipboard.writeText(stop.name);
      setCopiedId(stop.id);
      setTimeout(() => setCopiedId(null), 1200);
    } catch (e) {
      console.warn("copy failed", e);
    }
  };

  const handleKeyActivate = (e, stop) => {
    // Activate on Enter or Space
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(stop);
    }
  };

  return (
    <div className="space-y-3">
      {show && <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stops (e.g. Gandhipuram)"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            aria-label="Search bus stops"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500">Results</div>
          <div className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-700">
            {filtered.length}
          </div>
        </div>
      </div>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {shown.length === 0 ? (
          <div className="col-span-full py-6 text-center text-sm text-gray-500 bg-white rounded shadow-sm">
            No stops match your search.
          </div>
        ) : (
          shown.map((stop) => {
            const isSelected =
              selectedStopName && stop.name === selectedStopName;
            return (
              <div
                key={stop.id}
                role="button"
                tabIndex={0}
                onClick={() => {
                  let obj = stop;
                  obj["type"] = "stop";
                  obj["value"] = stop.name;
                  onSelect(stop);
                  handleSelect(obj);
                }}
                onDoubleClick={() => handleCopy(stop)}
                onKeyDown={(e) => handleKeyActivate(e, stop)}
                aria-pressed={isSelected}
                title={`${stop.name} — double-click to copy`}
                className={
                  "flex items-center justify-between gap-3 p-3 rounded-lg transition shadow-sm text-left " +
                  (isSelected
                    ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white transform scale-[1.01] ring-2 ring-offset-2 ring-sky-200"
                    : "bg-white hover:shadow-md focus:ring-2 focus:ring-blue-200")
                }
                style={{ minHeight: 56, outline: "none" }}
              >
                <div className="flex-1">
                  <div className="font-medium text-sm leading-tight">
                    {highlight(stop.name)}
                  </div>
                  <div className="text-xs mt-1">
                    <span className="text-gray-500">
                      {stop.lat &&
                      stop.lon &&
                      !(stop.lat === 0 && stop.lon === 0)
                        ? "Coords available"
                        : "Coords missing"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                    {(stop.buses || []).slice(0, 3).join(", ") || "—"}
                  </div>
                  <div className="flex gap-2">
                    {/* Inner buttons are safe because parent is not a <button> */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(stop);
                      }}
                      className={
                        "p-1 rounded-md text-xs " +
                        (copiedId === stop.id
                          ? "bg-white/20 text-white"
                          : "bg-gray-50 hover:bg-gray-100")
                      }
                      aria-label={`Copy ${stop.name}`}
                      title="Copy stop name"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16h8M8 12h8M8 8h8M3 20h18"
                        />
                      </svg>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(stop);
                      }}
                      className="p-1 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                      aria-label={`Select ${stop.name}`}
                      title="Select stop"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Show more / Show less control */}
      {filtered.length > initialCount && (
        <div className="text-center mt-2">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-sm"
            aria-expanded={expanded}
          >
            {expanded
              ? "Show less"
              : `Show more (${filtered.length - initialCount} more)`}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 transition-transform ${
                expanded ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
