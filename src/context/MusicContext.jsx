import {createContext,useContext,useEffect,useRef,useState,useCallback} from 'react';
import {config} from '../data/birthdayConfig';
const Ctx=createContext(null);export const useMusic=()=>useContext(Ctx);
export function MusicProvider({children}){
  const songs=config.songs,a=useRef(null),f=useRef(null),vol=useRef(.8),idxR=useRef(0),busy=useRef(false);
  const [idx,setIdx]=useState(0),[playing,setPlaying]=useState(false),[t,setT]=useState(0),[dur,setDur]=useState(0),[volume,setV]=useState(.8),[missing,setMissing]=useState(false);
  const fade=(from,to,ms,done)=>{clearInterval(f.current);const n=ms/20;let i=0;f.current=setInterval(()=>{i++;if(a.current)a.current.volume=Math.max(0,Math.min(1,(from+(to-from)*i/n)*vol.current));if(i>=n){clearInterval(f.current);done&&done()}},20)};
  const load=useCallback((i,go)=>{const e=a.current;i=(i+songs.length)%songs.length;idxR.current=i;setIdx(i);setMissing(false);setT(0);e.src=songs[i].src;e.volume=0;busy.current=false;
    if(go)e.play().then(()=>{setPlaying(true);fade(0,1,500)}).catch(()=>setPlaying(false));else setPlaying(false)},[]);
  const go=useCallback(d=>{const e=a.current;if(busy.current)return;busy.current=true;const was=!e.paused;if(was)fade(1,0,400,()=>{e.pause();load(idxR.current+d,true)});else load(idxR.current+d,false)},[load]);
  useEffect(()=>{const e=new Audio();e.preload='metadata';a.current=e;e.src=songs[0].src;e.volume=vol.current;
    const tu=()=>{setT(e.currentTime);if(!e.paused&&e.duration&&e.duration-e.currentTime<=.6&&!busy.current)go(1)};
    const on={timeupdate:tu,loadedmetadata:()=>setDur(e.duration),ended:()=>{if(busy.current)return;busy.current=true;load(idxR.current+1,true)},error:()=>{setMissing(true);setPlaying(false)},play:()=>setPlaying(true),pause:()=>{if(!busy.current)setPlaying(false)}};
    Object.entries(on).forEach(([k,v])=>e.addEventListener(k,v));
    return()=>{clearInterval(f.current);Object.entries(on).forEach(([k,v])=>e.removeEventListener(k,v));e.pause();e.removeAttribute('src');e.load()}},[go]);
  const toggle=()=>{const e=a.current;if(e.paused){e.volume=vol.current;e.play().catch(()=>setMissing(true))}else e.pause()};
  const select=i=>{if(i===idxR.current){toggle();return}clearInterval(f.current);a.current.pause();load(i,true)};
  const setVolume=v=>{vol.current=v;setV(v);if(a.current)a.current.volume=v};
  return <Ctx.Provider value={{songs,idx,song:songs[idx],playing,t,dur,volume,missing,toggle,next:()=>go(1),prev:()=>go(-1),select,setVolume}}>{children}</Ctx.Provider>
}
