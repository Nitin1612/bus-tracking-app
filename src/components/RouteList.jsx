import React from 'react'

export default function RouteList({ routes, onSelectRoute }){
  return (
    <div>
      <h3 className='font-semibold mb-3'>Routes</h3>
      <div className='grid gap-3 max-h-[60vh] overflow-auto'>
        { (routes||[]).map(r=>(
          <div key={r.busNo} className='p-3 rounded border border-blue-50 hover:bg-blue-50 cursor-pointer' onClick={()=>onSelectRoute(r.busNo)}>
            <div className='font-semibold'>{r.busNo}</div>
            <div className='text-sm text-gray-500'>{r.from} → {r.to}</div>
            <div className='text-xs text-gray-400 mt-1'>First: {r.firstBus} • Last: {r.lastBus} • ≈{r.frequencyMins} mins</div>
          </div>
        )) }
      </div>
    </div>
  )
}
