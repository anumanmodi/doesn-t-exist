import {useMemo} from 'react';
const COLORS=['#D89BA7','#F6E5E7','#875D66','#E8B4BC','#FFF9F4'];
export default function Balloons(){
  const items=useMemo(()=>Array.from({length:9},(_,i)=>({
    left:5+Math.random()*88,size:34+Math.random()*26,delay:Math.random()*1.4,
    dur:6+Math.random()*3,sway:Math.random()*40-20,c:COLORS[i%COLORS.length]})),[]);
  return <div className="balloons" aria-hidden="true">{items.map((b,i)=>
    <svg key={i} className="balloon" viewBox="0 0 40 70" style={{left:b.left+'%',width:b.size,animationDuration:b.dur+'s',animationDelay:b.delay+'s','--sway':b.sway+'px'}}>
      <path d="M20 2C9 2 3 11 3 21c0 11 8 20 17 22 9-2 17-11 17-22C37 11 31 2 20 2z" fill={b.c} stroke="#875D66" strokeOpacity=".25"/>
      <ellipse cx="13" cy="14" rx="4" ry="7" fill="#fff" opacity=".35" transform="rotate(-20 13 14)"/>
      <path d="M17 43l3 4 3-4z" fill={b.c}/>
      <path d="M20 47q-5 8 0 14t0 9" stroke="#66534E" strokeOpacity=".5" fill="none"/>
    </svg>)}</div>}