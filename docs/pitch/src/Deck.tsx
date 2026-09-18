import React from 'react';
import {AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {slides, starts, FPS} from './content';
const c={bg:'#050b13',text:'#e7f1ff',muted:'#9baec5',blue:'#4ca3ff',cyan:'#5ce5e1'};
const image=(name:string,style:React.CSSProperties)=> <Img src={staticFile(name)} style={style}/>;
const small:React.CSSProperties={fontSize:22,letterSpacing:4,fontWeight:600,color:c.cyan};
function Scene({index}:{index:number}) {
 const f=useCurrentFrame(); const s=slides[index];
 const opacity=interpolate(f,[0,16],[0,1],{extrapolateRight:'clamp'});
 const y=interpolate(f,[0,22],[22,0],{extrapolateRight:'clamp'});
 const titleStyle:React.CSSProperties={fontSize:72,lineHeight:1.08,letterSpacing:-2.6,fontWeight:650,whiteSpace:'pre-line',margin:'26px 0',maxWidth:1550};
 const caption:React.CSSProperties={fontSize:30,color:c.muted,lineHeight:1.5,maxWidth:1080};
 return <AbsoluteFill style={{background:c.bg,color:c.text,fontFamily:'Arial, Helvetica, sans-serif',padding:'72px 100px',overflow:'hidden'}}>
   {(s.kind==='hero'||s.kind==='close')&&<div style={{position:'absolute',right:0,top:0,width:1920,height:1080,opacity:s.kind==='hero'?.65:.28}}>{image('desktop-map.png',{position:'absolute',height:1080,width:1620,right:0,top:0,objectFit:'cover',objectPosition:'center'})}<AbsoluteFill style={{background:'linear-gradient(90deg,#050b13 12%,rgba(5,11,19,.9) 38%,transparent 95%),linear-gradient(0deg,#050b13,transparent 35%)'}}/></div>}
   <div style={{position:'relative',opacity,transform:`translateY(${y}px)`}}>
    <div style={small}>{s.label}</div>
    <h1 style={{...titleStyle,...((s.kind==='hero'||s.kind==='close')?{fontSize:104,maxWidth:1100,marginTop:150}:{})}}>{s.title}</h1>
    <div style={caption}>{s.subtitle}</div>
    {s.kind==='hero'&&<div style={{marginTop:90,fontSize:38,letterSpacing:10,color:c.blue}}>TRACE<span style={{display:'block',fontSize:18,letterSpacing:3,color:c.muted,marginTop:16}}>SEE WHERE YOUR DATA GOES</span></div>}
    {s.kind==='problem'&&<div style={{marginTop:100}}>{['Origen','Destino','Cambio'].map((t,i)=><div key={t} style={{display:'flex',alignItems:'baseline',gap:40,padding:'25px 0',borderBottom:'1px solid #233449',fontSize:44}}><span style={{color:c.blue,fontSize:24}}>0{i+1}</span><span style={{width:310}}>{t}</span><span style={{fontSize:30,color:c.muted}}>{['El dispositivo que inició la conexión.','El servicio o la organización de destino.','La señal que merece una revisión.'][i]}</span></div>)}</div>}
    {s.kind==='map'&&<div style={{marginTop:38,display:'flex',gap:55,alignItems:'center'}}>{image('desktop-map.png',{width:1000,height:610,objectFit:'contain',objectPosition:'left center'})}<div style={{fontSize:36,lineHeight:1.5,maxWidth:510}}><p>Explorá el mapa.</p><p>Elegí un flujo.</p><p style={{color:c.cyan}}>Abrí su contexto.</p><p style={{fontSize:24,color:c.muted}}>Captura del prototipo · datos simulados</p></div></div>}
    {(s.kind==='flow'||s.kind==='alert')&&<div style={{display:'flex',marginTop:38,gap:110,alignItems:'center'}}><div style={{width:650,fontSize:36,lineHeight:1.5}}>{(s.kind==='flow'?['El dispositivo que se conecta.','La ruta representada.','El destino y sus detalles.']:['Una señal para revisar.','El contexto del dispositivo.','El acceso al flujo asociado.']).map((t,i)=><p key={t}><span style={{color:s.kind==='alert'?'#ffbf47':c.blue,marginRight:25}}>0{i+1}</span>{t}</p>)}<p style={{color:c.muted,fontSize:24,marginTop:50}}>{s.kind==='flow'?'Rutas y valores simulados.':'Alerta simulada. No implica un ataque confirmado.'}</p></div>{image(s.kind==='flow'?'mobile-flow.png':'mobile-alert.png',{height:610,width:400,objectFit:'contain'})}</div>}
    {s.kind==='focus'&&<div style={{marginTop:125}}><div style={{fontSize:60,maxWidth:1420,lineHeight:1.3}}>“¿Qué dispositivo se conectó<br/>a este destino?”</div><div style={{fontSize:24,color:c.muted,marginTop:45}}>Pregunta de uso propuesta · segmento pendiente de validación</div></div>}
    {s.kind==='status'&&<div style={{display:'flex',marginTop:85,gap:130}}>{[['HOY','Mapa e inspector de flujos','Dispositivos y alertas','Datos simulados'],['SIGUIENTE HITO','Captura real consentida','Backend y autenticación','Validación con usuarios']].map((items,i)=><div key={i} style={{width:720}}><div style={{...small,color:i?c.muted:c.cyan,marginBottom:35}}>{items[0]}</div>{items.slice(1).map(t=><div key={t} style={{fontSize:36,padding:'23px 0',borderBottom:'1px solid #233449'}}>{t}</div>)}</div>)}</div>}
    {s.kind==='next'&&<div style={{marginTop:90}}>{[['01','Capturar','Metadatos en una red autorizada.'],['02','Interpretar','Dispositivo, destino y certeza de la ruta.'],['03','Medir','Tiempo de investigación y utilidad de las alertas.']].map(([n,t,d])=><div key={n} style={{display:'flex',alignItems:'baseline',gap:40,padding:'30px 0',borderBottom:'1px solid #233449'}}><span style={{fontSize:24,color:c.blue}}>{n}</span><span style={{fontSize:42,width:280}}>{t}</span><span style={{fontSize:30,color:c.muted}}>{d}</span></div>)}<div style={{fontSize:24,color:c.muted,marginTop:30}}>Experimento propuesto · sin resultados de piloto todavía</div></div>}
   </div>
   <div style={{position:'absolute',bottom:40,left:100,right:100,display:'flex',justifyContent:'space-between',fontSize:18,color:c.muted,letterSpacing:2}}><span>TRACE / FIE HACKATÓN</span><span>PROTOTIPO · {String(index+1).padStart(2,'0')} / 09</span></div>
   <div style={{position:'absolute',left:0,bottom:0,height:4,width:`${((index+1)/slides.length)*100}%`,background:c.blue}}/>
 </AbsoluteFill>;
}
export function Deck(){return <AbsoluteFill>{slides.map((s,i)=><Sequence key={s.kind} from={starts[i]} durationInFrames={s.seconds*FPS}><Scene index={i}/></Sequence>)}</AbsoluteFill>}
