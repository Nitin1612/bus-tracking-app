import React, { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-routing-machine/dist/leaflet-routing-machine.css"
import "leaflet-routing-machine"

export default function MapView({ stops = [], routes = [], selectedRoute = null, selectedStop = null }) {
  const mapRef = useRef(null)
  const routingControlRef = useRef(null)
  const userMarkerRef = useRef(null)
  const userCircleRef = useRef(null)

  useEffect(() => {
    if (!mapRef.current) {
      // Init map
      mapRef.current = L.map("map").setView([11.0168, 76.9558], 12)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current)
    }
    const map = mapRef.current

    // Clear old routing control
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current)
      routingControlRef.current = null
    }

    // Show stop markers
    stops.forEach((s) => {
      if (s.lat && s.lon && !(s.lat === 0 && s.lon === 0)) {
        const marker = L.circleMarker([s.lat, s.lon], {
          radius: 6,
          color: "#0ea5e9",
          fillOpacity: 0.9,
        }).addTo(map)
        marker.bindPopup(`<b>${s.name}</b><br/><small>${(s.buses || []).join(", ")}</small>`)
      }
    })

    // Routing: if bus route selected
    if (selectedRoute) {
      const route = routes.find((r) => r.busNo.toString() === selectedRoute.toString())
      if (route) {
        const fromStop = stops.find((s) => s.name.toLowerCase().includes(route.from.toLowerCase()))
        const toStop = stops.find((s) => s.name.toLowerCase().includes(route.to.toLowerCase()))
console.log(fromStop,toStop,"stop")
        if (fromStop && toStop && fromStop.lat && toStop.lat && toStop.lon && toStop.lon) {
          routingControlRef.current = L.Routing.control({
            waypoints: [L.latLng(fromStop.lat, fromStop.lon), L.latLng(toStop.lat, toStop.lon)],
            routeWhileDragging: true,
            showAlternatives: false,
          }).addTo(map)
        }
      }
    }

    // Routing: if stop selected (user → stop)
    if (selectedStop) {
      const stop = stops.find((s) => s.name === selectedStop)
      if (stop && stop.lat && stop.lon) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((pos) => {
            const userLat = pos.coords.latitude
            const userLon = pos.coords.longitude
            routingControlRef.current = L.Routing.control({
              waypoints: [L.latLng(userLat, userLon), L.latLng(stop.lat, stop.lon)],
              routeWhileDragging: true,
              showAlternatives: false,
            }).addTo(map)
          })
        }
      }
    }

    // Live location tracking
    // if (navigator.geolocation) {
    //   const trackUser = () => {
    //     navigator.geolocation.getCurrentPosition((pos) => {
    //       const { latitude, longitude, accuracy } = pos.coords

    //       if (userMarkerRef.current) map.removeLayer(userMarkerRef.current)
    //       if (userCircleRef.current) map.removeLayer(userCircleRef.current)

    //       userMarkerRef.current = L.marker([latitude, longitude])
    //       userCircleRef.current = L.circle([latitude, longitude], { radius: accuracy })

    //       const group = L.featureGroup([userMarkerRef.current, userCircleRef.current]).addTo(map)
    //       map.fitBounds(group.getBounds())
    //     })
    //   }
    //   const interval = setInterval(trackUser, 50000)
    //   trackUser()

    //   return () => clearInterval(interval)
    // }
  }, [stops, routes, selectedRoute, selectedStop])

  return <div id="map" className="w-full h-[60vh] rounded-lg" />
}
