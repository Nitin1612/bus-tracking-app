import React from "react";

export default function RecentList({ title, items, type, handleSelect }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm ">
      <h3 className="mb-3 font-semibold">{title}</h3>
      <div className="grid gap-3">
        {items.map((it, idx) => (
          <div
            key={idx}
            className="p-3 rounded border border-gray-100 flex justify-between items-center cursor-pointer hover:shadow-xl"
            onClick={(e) => {
              let obj = it;
              console.log(it,"bussss")
              obj["type"] = type == "bus" ? "route" : type;
              obj["value"] = it.name || it.busNo;
              handleSelect(obj);
            }}
          >
            <div>
              <div className="font-semibold">
                {type === "stop" ? it.name : it.busNo}
              </div>
              <div className="text-sm text-gray-500">
                {type === "stop"
                  ? (it.buses || []).slice(0, 5).join(", ")
                  : `${it.from} → ${it.to}`}
              </div>
            </div>
            <div className="text-right text-sm text-gray-500">
              {type === "stop"
                ? ""
                : `First: ${it.firstBus} • Last: ${it.lastBus}`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
