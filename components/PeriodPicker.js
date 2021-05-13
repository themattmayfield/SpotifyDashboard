// import React, { useState, useEffect } from "react";

// const classes = {
//     active: 'border-b border-white',
//     inactive: 'border-b border-transparent'
// }

// const periods = [
//     {
//         name: 'All Time',
//         id: '0'
//     },
//     {
//         name: 'Last 6 Months',
//         id: '1'
//     },
//     {
//         name: 'Last 4 Weeks',
//         id: '2'
//     }
// ]
// export default function PeriodPicker() {
//     const [active, setActive] = useState('0')
//     return (
        
        
//         <div className="sticky top-0 bg-black flex w-full items-center justify-center space-x-4 text-white pb-6 mb-4 select-none">
//             {periods.map((period) => (
//                 <p onClick={() => setActive(period.id)} key={period.id} className={'cursor-pointer ' + (active == period.id ? classes.active : classes.inactive)}>{period.name}</p>
//             ))}
//         </div>
        
//     )
// }