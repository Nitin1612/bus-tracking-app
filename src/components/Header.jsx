import React from 'react';

export default function Header(){ 
  return (
    <header className='flex items-center justify-between gap-4 mb-4 w-full absolute'>
        <div className='w-full'>
          <div className='font-bold z-50 text-lg md:text-4xl lg:text-4xl p-4 text-gray-600'>BUS TRACKING APPLICATION</div>
      </div>
    </header>
  )
}
