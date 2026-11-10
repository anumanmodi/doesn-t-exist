import {useState,useEffect,useRef} from 'react';
import confetti from 'canvas-confetti';
import {X,ChevronLeft,ChevronRight,Mic,Play,Pause} from 'lucide-react';
import {config as c} from '../data/birthdayConfig';
import {useMusic} from '../context/MusicContext';

export const Photo=({src,alt,ratio='4/5',onClick})=>{
  const [bad,setBad]=useState(false);
  return <div className="ph" style={{aspectRatio:ratio}} onClick={onClick}>{bad?<span>Photo placeholder<small>{src}</small></span>:<img src={src} alt={alt||''} loading="lazy" onError={()=>setBad(true)}/>}</div>};

export function Envelope({next}){
  const [s,setS]=useState(0);
  const open=()=>{if(s)return;setS(1);setTimeout(()=>setS(2),700);setTimeout(()=>setS(3),1500);setTimeout(next,2900)};
  return <section className="screen center"><p className="script">{c.intro}</p>
    <div className={`env s${s}`}><div className="paper"><span>{c.nickname}</span></div><div className="flap"/><div className="front"/><div className="seal"><b>{c.name[0]}</b></div></div>
    <button className="btn" onClick={open} disabled={s>0}>Open your little surprise 💌</button></section>}

export const Letter=({next})=><section className="screen"><h2 className="display sm">{c.letterHeading}</h2><article className="sheet letter">
  {c.letter.map((t,i)=><p key={i} className="rise" style={{animationDelay:Math.min(i*.45,4)+'s'}}>{t}</p>)}</article>
  <p className="script big rise" style={{animationDelay:'4.6s',textAlign:'center'}}>{c.letterEnding}</p>
  <button className="btn rise" style={{animationDelay:'5s'}} onClick={next}>Turn the page</button></section>;

export function Cake({next}){
  const [out,setOut]=useState(false),[mic,setMic]=useState('idle'),stop=useRef(null),timer=useRef(null);
  const blow=()=>{if(out)return;stop.current&&stop.current();setOut(true);setMic('idle');timer.current=setTimeout(next,2400)};
  useEffect(()=>()=>{stop.current&&stop.current();clearTimeout(timer.current)},[]);
  const listen=async()=>{
    try{
      const st=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false}});
      const ctx=new (window.AudioContext||window.webkitAudioContext)(),an=ctx.createAnalyser();an.fftSize=1024;ctx.createMediaStreamSource(st).connect(an);
      const buf=new Float32Array(an.fftSize);let raf,t0=performance.now(),base=0,n=0,since=0;
      stop.current=()=>{cancelAnimationFrame(raf);st.getTracks().forEach(t=>t.stop());ctx.close();stop.current=null};
      const loop=()=>{an.getFloatTimeDomainData(buf);let s=0;for(const v of buf)s+=v*v;const r=Math.sqrt(s/buf.length),now=performance.now();
        if(now-t0<800){base=(base*n+r)/(n+1);n++}
        else if(r>Math.max(base*3,.05)){since=since||now;if(now-since>400){blow();return}}else since=0;
        raf=requestAnimationFrame(loop)};
      loop();setMic('on');
    }catch{setMic('denied')}};
  const X0=[88,120,152];
  return <section className="screen center"><h2 className="display sm">{c.wishHeading}</h2><p className="script">{out?'Wish sent. 🤍':c.wishHint}</p>
    <svg className={'cake'+(out?' out':'')} viewBox="0 0 240 250" role="img" aria-label="Birthday cake with candles">
      <ellipse cx="120" cy="232" rx="108" ry="10" fill="#66534E" opacity=".18"/><rect x="16" y="214" width="208" height="10" rx="5" fill="#fff" stroke="#D8C9C2"/>
      <rect x="30" y="160" width="180" height="56" rx="10" fill="#F6E5E7"/><path d="M30 170q15 18 30 0t30 0 30 0 30 0 30 0 30 0v-8q0-2-10-2H40q-10 0-10 2z" fill="#fff"/>
      <rect x="62" y="110" width="116" height="52" rx="10" fill="#D89BA7"/><path d="M62 120q14 18 29 0t29 0 29 0 29 0v-8q0-2-8-2H70q-8 0-8 2z" fill="#FFF9F4"/>
      <rect x="56" y="152" width="128" height="4" fill="#875D66" opacity=".25"/>
      {X0.map((x,i)=><g key={x}><rect x={x-3} y="72" width="6" height="40" rx="2" fill="#FFF9F4" stroke="#D89BA7"/><path className="flame" style={{animationDelay:i*.3+'s'}} d={`M${x} 52q7 10 0 18q-7-8 0-18z`} fill="#F4B860"/><path className="flame" d={`M${x} 60q3 5 0 9q-3-4 0-9z`} fill="#FFF3D6"/><path className="smoke" d={`M${x} 60q-6-8 0-16t0-14`} stroke="#66534E" fill="none" opacity="0"/></g>)}
    </svg>
    {!out&&<div className="stack"><button className="btn" onClick={listen} disabled={mic==='on'}><Mic size={16}/> {mic==='on'?'Listening... blow gently':'Blow with your breath'}</button>
      <button className="btn ghost" onClick={blow}>Tap to blow</button>
      {mic==='denied'&&<small>Microphone isn't available, so please use Tap to blow.</small>}</div>}</section>}

export function Reveal({next}){
  useEffect(()=>{const o={colors:['#D89BA7','#F6E5E7','#875D66','#FFFFFF'],scalar:.9,gravity:.7,disableForReducedMotion:true};
    confetti({...o,particleCount:70,spread:80,origin:{y:.55}});const t=setTimeout(()=>confetti({...o,particleCount:40,spread:110,origin:{y:.4}}),700);return()=>{clearTimeout(t);confetti.reset()}},[]);
  return <section className="screen center"><h1 className="display rise">{c.revealHeading}</h1><p className="script big rise" style={{animationDelay:'.8s'}}>{c.name}</p>
    <p className="lead rise" style={{animationDelay:'1.6s'}}>{c.birthdayMessage}</p><button className="btn rise" style={{animationDelay:'2.4s'}} onClick={next}>Continue</button></section>}

function Lightbox({items,i,setI,kind}){
  useEffect(()=>{const k=e=>{if(e.key==='Escape')setI(null);if(e.key==='ArrowRight')setI((i+1)%items.length);if(e.key==='ArrowLeft')setI((i-1+items.length)%items.length)};addEventListener('keydown',k);return()=>removeEventListener('keydown',k)},[i]);
  const it=items[i],[rw,rh]=it.ratio.split('/');return <div className="lb" onClick={()=>setI(null)}><button className="x" aria-label="Close"><X/></button>
    <button className="nv l" aria-label="Previous" onClick={e=>{e.stopPropagation();setI((i-1+items.length)%items.length)}}><ChevronLeft/></button>
    <figure key={i} style={{'--ar':rw/rh}} onClick={e=>e.stopPropagation()}><Photo src={it.src} ratio={it.ratio||'4/5'} alt={it.caption}/><figcaption className="script">{it.caption}</figcaption></figure>
    <button className="nv r" aria-label="Next" onClick={e=>{e.stopPropagation();setI((i+1)%items.length)}}><ChevronRight/></button></div>}

export function Gallery({kind,next}){
  const [i,setI]=useState(null),items=kind==='her'?c.her:c.us;
  return <section className="screen"><h2 className="display sm">{kind==='her'?c.herHeading:c.usHeading}</h2><p className="script">{kind==='her'?c.herSub:c.usSub}</p>
    <div className={kind==='her'?'masonry':'album'}>{items.map((it,n)=><figure key={n} className={kind==='us'?'polaroid':'tile'} style={kind==='us'?{'--r':[-3,2,-1.5,3,-2,1.5][n%6]+'deg'}:null}>
      {kind==='us'&&<i className="tape"/>}<button onClick={()=>setI(n)} aria-label={'Open '+it.caption}><Photo src={it.src} ratio={it.ratio} alt={it.caption}/></button>
      <figcaption className={kind==='us'?'script':''}>{it.caption}{it.date&&<small>{it.date}{it.place&&' · '+it.place}</small>}</figcaption></figure>)}</div>
    {i!==null&&<Lightbox items={items} i={i} setI={setI}/>}<button className="btn" onClick={next}>Continue</button></section>}

export function Reasons({next}){
  const [open,setOpen]=useState([]);
  return <section className="screen"><h2 className="display sm">{c.reasonsHeading}</h2><p className="prog">{open.length} of {c.reasons.length} opened</p>
    <div className="cards">{c.reasons.map((r,n)=>{const o=open.includes(n);return <button key={n} className={'card v'+(n%3)+(o?' open':'')} aria-expanded={o} onClick={()=>!o&&setOpen([...open,n])}>
      <span className="face">{o?r:<span className="script big">{n+1}</span>}</span></button>})}</div>
    <button className="btn" onClick={next}>Continue</button></section>}

export function Cover({i,round}){
  const t=c.songs[i],[bg,fg,ac]=t.c,id='g'+i;
  const m={sun:<><circle cx="100" cy="86" r="34" fill={ac}/><path d="M20 128h160" stroke={fg} strokeWidth="1.5"/></>,
    moon:<><circle cx="100" cy="82" r="32" fill={ac}/><circle cx="114" cy="74" r="28" fill={bg}/></>,
    strings:<>{[0,1,2,3,4].map(k=><path key={k} d={`M20 ${60+k*10}q80 ${-30+k*12} 160 0`} stroke={ac} fill="none" strokeWidth="1.4"/>)}</>,
    waves:<>{[0,1,2].map(k=><path key={k} d={`M20 ${70+k*16}q20-14 40 0t40 0 40 0 40 0`} stroke={ac} fill="none" strokeWidth="2"/>)}</>}[t.motif];
  return <svg viewBox="0 0 200 200" className={'cover'+(round?' round':'')} role="img" aria-label={'Cover art for '+t.title}><defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={bg}/><stop offset="1" stopColor={bg} stopOpacity=".85"/></linearGradient></defs>
    <rect width="200" height="200" fill={`url(#${id})`}/><rect x="8" y="8" width="184" height="184" fill="none" stroke={fg} strokeOpacity=".5"/>{m}
    {!round&&<><text x="100" y="156" textAnchor="middle" fill={fg} fontFamily="Cormorant Garamond,serif" fontStyle="italic" fontSize="19">{t.lines[0]}</text><text x="100" y="177" textAnchor="middle" fill={fg} fontFamily="Cormorant Garamond,serif" fontStyle="italic" fontSize="19">{t.lines[1]}</text><text x="100" y="24" textAnchor="middle" fill={fg} fontFamily="DM Sans,sans-serif" fontSize="7" letterSpacing="2">BOOBU FM</text></>}</svg>}

export function Radio({next}){
  const m=useMusic(),r=c.radio,[on,setOn]=useState(m.playing);
  const tune=()=>{setOn(true);if(!m.playing)m.toggle()};
  return <section className="screen center radio"><p className="onair"><i className={m.playing?'live':''}/>{r.label}</p>
    <h2 className="display">{r.name}</h2><p className="script">{r.tagline}</p>
    {!on?<><p className="lead">{r.intro}</p><button className="btn" onClick={tune}>Tune in</button></>:<>
      <div className="dial" aria-hidden="true"><div className="ticks">{Array.from({length:41},(_,k)=><u key={k} className={k%10===0?'big':''}/>)}</div><i className="needle" style={{left:(12+m.idx*25.3)+'%'}}/><div className="fq">{r.freqs.map((f,k)=><span key={k} className={k===m.idx?'on':''}>{f}</span>)}</div></div>
      <div className="deck"><div className={'vinyl'+(m.playing?' spin':'')}><div className="lab"><Cover i={m.idx} round/></div></div><div className="sleeve"><Cover i={m.idx}/></div></div>
      <div className={'wave'+(m.playing?' go':'')} aria-hidden="true">{Array.from({length:26},(_,k)=><i key={k} style={{animationDelay:(k*.07)%.9+'s',height:20+(k*37%60)+'%'}}/>)}</div>
      <div><p className="np">{m.song.title}</p><small>{m.song.artist||'Our playlist'}{m.missing&&' · audio file missing'}</small></div>
      <ol className="list">{m.songs.map((t,n)=><li key={n}><button className={n===m.idx?'on':''} onClick={()=>m.select(n)}><span className="mini"><Cover i={n}/></span><span><b>{t.title}</b><small>{t.artist||r.freqs[n]+' FM'}</small></span>{n===m.idx&&m.playing?<Pause size={16}/>:<Play size={16}/>}</button></li>)}</ol>
      <button className="btn" onClick={next}>One last thing</button></>}</section>}

export function Final(){
  const [w,h]=c.finalPhotoRatio.split('/');
  return <section className="screen center final"><h2 className="display sm">{c.finalHeading}</h2>
    <figure className="print" style={{'--ar':w/h}}><Photo src={c.finalPhoto} ratio={c.finalPhotoRatio} alt="Our favourite photograph together"/><figcaption className="script big">{c.finalCaption}</figcaption></figure>
    <article className="sheet letter">{c.finalMessage.map((t,i)=><p key={i} className={i===0?'script big':''}>{t}</p>)}</article>
    <p className="display sm closing">{c.finalClosing}</p></section>}
