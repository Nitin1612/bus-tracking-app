import React, { useState, useMemo } from 'react';

export default function AutocompleteSearch({stops, routes, onSelect}){
  const [q, setQ] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);

  const suggestions = useMemo(()=>{
    if(!q) return [];
    const ql = q.toLowerCase();
    const stopMatches = (stops||[]).filter(s=> s.name && s.name.toLowerCase().includes(ql)).slice(0,6).map(s=>({type:'stop', label:s.name, value:s.name}));
    const routeMatches = (routes||[]).filter(r=> r.busNo && r.busNo.toString().toLowerCase().includes(ql)).slice(0,6).map(r=>({type:'route', label:`${r.busNo} — ${r.from} → ${r.to}`, value:r.busNo}));
    return [...routeMatches, ...stopMatches];
  }, [q, stops, routes]);

  const onKeyDown = (e) => {
    if(e.key === 'ArrowDown') { setActiveIndex(i=> Math.min(i+1, suggestions.length-1)); }
    else if(e.key === 'ArrowUp'){ setActiveIndex(i=> Math.max(i-1, 0)); }
    else if(e.key === 'Enter'){
      if(suggestions[activeIndex]){
        const sel = suggestions[activeIndex];
        onSelect(sel);
        setQ('');
        setActiveIndex(-1);
      } else {
        onSelect({ type: 'free', label: q, value: q });
        setQ('');
      }
    }
  }

  return (
    <div className='relative'>
      <input 
        value={q} 
        onChange={e=>{ setQ(e.target.value); setActiveIndex(-1); }} 
        onKeyDown={onKeyDown}
        placeholder='Search by bus no. (eg. 6A) or stop name (eg. Gandhipuram)'
        className='w-full p-3 rounded-lg border border-gray-200'
      />
      {suggestions.length>0 && (
        <div className='absolute left-0 right-0 top-full bg-white shadow-lg rounded-lg mt-2 z-40'>
          {suggestions.map((s, idx)=>(
            <div 
              key={idx} 
              onMouseDown={()=>{ onSelect(s); setQ(''); setActiveIndex(-1); }}
              className={'p-3 border-t '+ (idx===0? 'border-none':'' ) + (idx===activeIndex? ' bg-blue-50' : '')}
              style={{cursor:'pointer'}}
            >
              <div className='font-semibold'>{s.type === 'route' ? s.value : s.label}</div>
              <div className='text-sm text-gray-500'>{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
