import React, { useState } from 'react'

export default function SearchBar({ routes, stops, onSearchRoute, onSearchStop }){
  const [q, setQ] = useState('')

  const handleSearch = ()=>{
    const query = q.trim().toLowerCase()
    if(!query) return
    const route = (routes||[]).find(r=> r.busNo && r.busNo.toString().toLowerCase() === query)
    const stop = (stops||[]).find(s=> s.name && s.name.toLowerCase().includes(query))
    if(route && onSearchRoute){ onSearchRoute(route.busNo) }
    if(stop && onSearchStop){ onSearchStop(stop.name) }
    if(!route && !stop){ alert('No matching bus or stop found') }
  }

  return (
    <div className="search-row">
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by bus no or stop name" className="p-2 border rounded flex-1" />
      <button onClick={handleSearch} className="ml-2 px-4 py-2 bg-blue-600 text-white rounded">Search</button>
    </div>
  )
}
