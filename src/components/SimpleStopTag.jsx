import React, { useMemo, useState } from "react";

/**
 * BottomStopTags - simple tag UI to place below autocomplete
 *
 * Props:
 *  - stops: array of { id, name, lat, lon, buses?: [] }
 *  - onSelect: function(stop) called when a tag is clicked/activated
 *  - initialCount: how many tags to show when collapsed (default 10)
 *
 * Notes:
 *  - This component is intentionally minimal: tag shows only stop.name.
 *  - Does NOT modify autocomplete CSS; it is self-contained inside its own card.
 */
export default function BottomStopTags({
  stops = [],
  onSelect = () => {},
  initialCount = 10,
}) {
  const [expanded, setExpanded] = useState(false);

  // sort by number of buses (descending), then name
  const sorted = useMemo(() => {
    return (stops || []).slice().sort((a, b) => {
      const la = (a.buses || []).length;
      const lb = (b.buses || []).length;
      if (la !== lb) return lb - la;
      return (a.name || "").localeCompare(b.name || "");
    });
  }, [stops]);

  const shown = expanded ? sorted : sorted.slice(0, initialCount);

  const handleKey = (e, stop) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(stop);
    }
  };

  return (
    <div className="mt-4 max-w-full hidden md:block mr-4 p-2">
      {/* Card container — separate border, won't affect autocomplete */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-sm font-semibold text-gray-800">Top stops</div>
            <div className="text-xs text-gray-500">
              Tap a stop to navigate from your location
            </div>
          </div>
          <div className="text-xs text-gray-400">10</div>
        </div>

        <div className="flex flex-wrap gap-2">
          {shown.map((stop) => (
            <div
              key={stop.id ?? stop.name}
              role="button"
              tabIndex={0}
              onClick={() => {
                let obj = stop;
                obj["type"] = "stop";
                obj["value"] = stop.name;
                onSelect(obj);
              }}
              onKeyDown={(e) => handleKey(e, stop)}
              title={stop.name}
              className="px-3 py-1 rounded-full bg-gradient-to-r from-white to-gray-50 border border-gray-100 text-sm text-gray-700 shadow-sm hover:shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-200 transition-transform transform hover:-translate-y-0.5"
              style={{ minWidth: 110, textAlign: "center" }}
            >
              {stop.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
