import {useState,useRef} from 'react';
import {MusicProvider} from './context/MusicContext';
import MusicPlayer from './components/MusicPlayer';
import {Envelope,Letter,Cake,Reveal,Gallery,Reasons,Radio,Final} from './components/Screens';
export default function App(){
  const [s,setS]=useState(0),[max,setMax]=useState(0),ref=useRef(null);
  const go=n=>{setS(n);setMax(m=>Math.max(m,n));scrollTo(0,0)};const nx=()=>go(s+1);
  const S=[<Envelope next={nx}/>,<Letter next={nx}/>,<Cake next={nx}/>,<Reveal next={nx}/>,<Gallery kind="her" next={nx}/>,<Gallery kind="us" next={nx}/>,<Reasons next={nx}/>,<Radio next={nx}/>,<Final/>];
  return <MusicProvider><main key={s} className="fade">{S[s]}</main>
    {s>0&&<nav className="dots" aria-label="Sections">{S.slice(1).map((_,i)=><button key={i} aria-label={'Screen '+(i+2)} className={s===i+1?'on':''} disabled={i+1>max} onClick={()=>go(i+1)}/>)}</nav>}
    {s>0&&<MusicPlayer/>}</MusicProvider>}
