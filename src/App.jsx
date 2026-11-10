import {useState,useEffect} from 'react';
import confetti from 'canvas-confetti';
import {MusicProvider} from './context/MusicContext';
import MusicPlayer from './components/MusicPlayer';
import Balloons from './components/Balloons';
import {Envelope,Letter,Cake,Reveal,Gallery,Reasons,Radio,Final} from './components/Screens';
export default function App(){
  const [s,setS]=useState(0),[max,setMax]=useState(0);
  const go=n=>{setS(n);setMax(m=>Math.max(m,n));scrollTo(0,0)};const nx=()=>go(s+1);
  useEffect(()=>{if(s>0&&s!==3)confetti({particleCount:28,spread:70,startVelocity:28,gravity:.8,origin:{x:.5,y:1.05},scalar:.8,colors:['#D89BA7','#F6E5E7','#875D66','#FFFFFF'],disableForReducedMotion:true})},[s]);
  const S=[<Envelope next={nx}/>,<Letter next={nx}/>,<Cake next={nx}/>,<Reveal next={nx}/>,<Gallery kind="her" next={nx}/>,<Gallery kind="us" next={nx}/>,<Reasons next={nx}/>,<Radio next={nx}/>,<Final/>];
  return <MusicProvider><main key={s} className="fade">{S[s]}</main>
    {s>0&&<Balloons key={'b'+s}/>}
    {s>0&&<nav className="dots" aria-label="Sections">{S.slice(1).map((_,i)=><button key={i} aria-label={'Screen '+(i+2)} className={s===i+1?'on':''} disabled={i+1>max} onClick={()=>go(i+1)}/>)}</nav>}
    {s>0&&<MusicPlayer/>}</MusicProvider>}