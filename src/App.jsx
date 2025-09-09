import React, { useState } from "react";
import Header from "./components/Header";
import AutocompleteSearch from "./components/AutocompleteSearch";
import RecentList from "./components/RecentList";
import MapView from "./components/MapView";
import RouteList from "./components/RouteList";
import busstopsData from "./data/busstops.json";
import busroutesData from "./data/busroutes.json";
import recentData from "./data/recent.json";
import StopTags from "./components/StopTags";
import BottomStopTags from "./components/SimpleStopTag";

function downloadJSON(filename, obj) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function App() {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedStop, setSelectedStop] = useState(null);

  const handleSelect = (sel) => {
    if (!sel) return;
    window.location.href = "#map";
    setSelectedRoute(null);
    setSelectedStop(null);
    if (sel.type === "route") {
      setSelectedRoute(sel.value);
      setSelectedStop(null);
    } else if (sel.type === "stop") {
      setSelectedStop(sel.value);
      setSelectedRoute(null);
    } else if (sel.type === "free") {
      const q = sel.value.toString().toLowerCase();
      const route = busroutesData.busroutes.find(
        (r) => r.busNo.toString().toLowerCase() === q
      );
      const stop = busstopsData.busstops.find((s) =>
        s.name.toLowerCase().includes(q)
      );
      if (route) {
        setSelectedRoute(route.busNo);
        setSelectedStop(null);
      }
      if (stop) {
        setSelectedStop(stop.name);
        setSelectedRoute(null);
      }
    }
  };

  const exportGeocoded = () => {
    // No geocode now; export same file
    downloadJSON("busstops.json", { busstops: busstopsData.busstops });
  };

  return (
    <div className="app">
      <div className="relative">
        <Header />
        <div className="mb-4 max-h-svh">
          <img
            src="https://uffizio.com/wp-content/uploads/2024/02/ADAS-60-1.jpg"
            alt="bg"
            className="w-full rounded-lg shadow-sm"
          />
        </div>

        <div className="">
          <div className="max-w-full m-2 md:w-1/2 md:absolute md:right-20 md:top-1/4 rounded-lg shadow-xl shadow-black">
            <AutocompleteSearch
              stops={busstopsData.busstops}
              routes={busroutesData.busroutes}
              onSelect={handleSelect}
            />
          </div>

          <div className=" md:w-1/2 md:absolute md:right-20 md:top-1/3">
            <BottomStopTags
              stops={busstopsData.busstops}
              onSelect={handleSelect}
              initialCount={10}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:mt-52 max-w-6xl mx-auto ">
        <div className=" space-y-4">
          <div className="map-card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Live Map</h2>
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-500">Updated just now</div>
              </div>
            </div>
            <MapView
              stops={busstopsData.busstops}
              routes={busroutesData.busroutes}
              selectedRoute={selectedRoute}
              selectedStop={selectedStop}
            />
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-blue-50 rounded">
                <div className="font-semibold">Stops</div>
                <div className="text-sm text-gray-600">
                  {busstopsData.busstops.length}+
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded">
                <div className="font-semibold">Routes</div>
                <div className="text-sm text-gray-600">
                  {busroutesData.busroutes.length}+
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded">
                <div className="font-semibold">Active Buses</div>
                <div className="text-sm text-gray-600">50+</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <RecentList
            title="Recent Stops"
            items={recentData.recentStops}
            type="stop"
            handleSelect={handleSelect}
          />
          <RecentList
            title="Recent Buses"
            items={recentData.recentBuses}
            type="bus"
            handleSelect={handleSelect}
          />
        </div>
        <div className="space-y-4 p-2">
          <StopTags
            stops={busstopsData.busstops}
            onSelect={(stop) => {
              setSelectedStop(stop);
            }}
            handleSelect={handleSelect}
            selectedStopName={selectedStop?.name}
            maxShown={0}
            show={true}
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-6 text-sm text-gray-500">
        Author : Arundhadhi S
      </div>
    </div>
  );
}
