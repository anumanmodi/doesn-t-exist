import {Play,Pause,SkipBack,SkipForward,Volume2} from 'lucide-react';
import {useMusic} from '../context/MusicContext';
export default function MusicPlayer(){
  const m=useMusic(),pct=m.dur?Math.min(100,m.t/m.dur*100):0;
  return <div className="player" role="region" aria-label="Music player">
    <div className="pinfo"><b>{m.song.title}</b><small>{m.missing?'Audio file not added yet':m.song.artist}</small></div>
    <button aria-label="Previous" onClick={m.prev}><SkipBack size={18}/></button>
    <button className="pp" aria-label={m.playing?'Pause':'Play'} onClick={m.toggle}>{m.playing?<Pause size={18}/>:<Play size={18}/>}</button>
    <button aria-label="Next" onClick={m.next}><SkipForward size={18}/></button>
    <label className="vol"><Volume2 size={15}/><input type="range" min="0" max="1" step=".05" value={m.volume} onChange={e=>m.setVolume(+e.target.value)} aria-label="Volume"/></label>
    <div className="bar"><i style={{width:pct+'%'}}/></div>
  </div>}
