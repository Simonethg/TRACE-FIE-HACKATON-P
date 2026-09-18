const fs = require("fs");
const path = "e:/TRACE/index.html";
let h = fs.readFileSync(path, "utf8");
const start = h.indexOf("/* ---------- globe ---------- */");
const end = h.indexOf("function drawLabels()");
if (start < 0 || end < 0) {
  console.error("markers not found", start, end);
  process.exit(1);
}
const block = `/* ---------- globe ---------- */
const G = {
  ry: 2.62, rx: 0.28, dist: 2.45, dragging:false, lx:0, ly:0, auto:!reduced
};

function latlon(lat,lon,r=1){
  const a=lat*Math.PI/180, o=lon*Math.PI/180, c=Math.cos(a);
  return [c*Math.cos(o)*r, Math.sin(a)*r, c*Math.sin(o)*r];
}
function mul(a,b){
  const r=new Float32Array(16);
  for(let i=0;i<4;i++) for(let j=0;j<4;j++) r[i*4+j]=a[i*4]*b[j]+a[i*4+1]*b[4+j]+a[i*4+2]*b[8+j]+a[i*4+3]*b[12+j];
  return r;
}
function rotXY(rx,ry){
  const cx=Math.cos(rx),sx=Math.sin(rx),cy=Math.cos(ry),sy=Math.sin(ry);
  const Rx=new Float32Array([1,0,0,0, 0,cx,sx,0, 0,-sx,cx,0, 0,0,0,1]);
  const Ry=new Float32Array([cy,0,-sy,0, 0,1,0,0, sy,0,cy,0, 0,0,0,1]);
  return mul(Rx,Ry);
}

let glCanvas, ctx2d, arcs=[], COASTS=[], BORDERS=[];
const CITIES=[[-58.38,-34.6],[-118.24,34.05],[-80.19,25.76],[-0.12,51.5],[-46.63,-23.55],[-74.01,40.71],[-3.7,40.42],[2.35,48.86],[13.41,52.52],[12.5,41.9],[-99.13,19.43],[-43.17,-22.91],[-70.67,-33.45],[-77.03,-12.05],[37.62,55.75],[139.69,35.69],[121.47,31.23],[114.17,22.32],[103.82,1.35],[151.21,-33.87],[144.96,-37.81],[18.42,-33.92],[28.05,-26.20],[3.38,6.52],[31.24,30.04],[39.16,21.49],[77.21,28.61],[72.88,19.08],[88.36,22.57],[100.50,13.76],[106.63,10.82],[-6.26,53.35],[-9.14,38.72],[4.90,52.37],[12.57,55.68],[18.07,59.33],[28.98,41.01],[-122.42,37.77],[-87.63,41.88],[-95.37,29.76],[-79.38,43.65],[-123.12,49.28],[55.27,25.20],[67.00,24.86],[-0.13,5.60],[32.58,-25.97],[116.41,39.90],[127.02,37.57],[135.50,34.69],[-47.93,-15.78],[-56.16,-34.90],[8.68,50.11],[4.35,50.85],[16.37,48.21],[-71.06,42.36],[-75.16,39.95],[23.32,42.70],[-1.90,52.48]];

function unpackRing(arr,s){
  let x=arr[0], y=arr[1]; const pts=[[x*s,y*s]];
  for(let i=2;i<arr.length;i+=2){ x+=arr[i]; y+=arr[i+1]; pts.push([x*s,y*s]); }
  return pts;
}
function loadGeo(){
  const g=window.TRACE_GEO; if(!g||COASTS.length) return;
  COASTS=(g.land||[]).map(r=>unpackRing(r,g.s));
  BORDERS=(g.borders||[]).map(r=>unpackRing(r,g.s));
}

function great(a,b,n=64,alt=0.12){
  const A=latlon(a.lat,a.lon), B=latlon(b.lat,b.lon);
  const d=A[0]*B[0]+A[1]*B[1]+A[2]*B[2], om=Math.acos(Math.min(1,Math.max(-1,d)));
  const pts=[];
  for(let i=0;i<=n;i++){
    const t=i/n, s=Math.sin(om)||1, k=Math.sin((1-t)*om)/s, j=Math.sin(t*om)/s;
    const x=A[0]*k+B[0]*j, y=A[1]*k+B[1]*j, z=A[2]*k+B[2]*j;
    const lift=1+alt*Math.sin(Math.PI*t);
    pts.push(x*lift,y*lift,z*lift);
  }
  return pts;
}
function nodeBy(id){ return NODES.find(n=>n.id===id); }

function buildArcs(){
  const fl=flows.find(f=>f.id===S.flow) || flows[0];
  const pairs=[["ba","la"],["ba","mia"],["mia","lon"],["ba","sp"],["mia","sat"]];
  if(fl.bad) pairs.push(["ba","nl"]);
  arcs=pairs.map(([a,b])=>{
    const A=nodeBy(a), B=nodeBy(b);
    const col = (a==="ba"&&b==="nl") ? "#ff596a" : (b==="sat"?"#5ce5e1":"#6ec1ff");
    return {pts:great(A,B,56, b==="sat"?0.28:0.16), col, dashed:(a==="mia"&&b==="lon"), sel:fl.path.includes(a)&&fl.path.includes(b)};
  });
}

function resizeGL(){
  if(!glCanvas) return;
  const dpr=Math.min(devicePixelRatio||1, 2);
  const r=glCanvas.parentElement.getBoundingClientRect();
  const w=Math.max(1,r.width*dpr), h=Math.max(1,r.height*dpr);
  if(glCanvas.width!==w || glCanvas.height!==h){ glCanvas.width=w; glCanvas.height=h; }
  ctx2d=glCanvas.getContext("2d");
}

function projectXYZ(x,y,z){
  if(!glCanvas) return null;
  const M=rotXY(G.rx,G.ry);
  const X=M[0]*x+M[4]*y+M[8]*z, Y=M[1]*x+M[5]*y+M[9]*z, Z=M[2]*x+M[6]*y+M[10]*z;
  if(Z<0.02) return null;
  const w=glCanvas.clientWidth, h=glCanvas.clientHeight;
  const R=Math.min(w,h)*0.42*(2.6/G.dist);
  return {x:w/2+X*R, y:h*0.52-Y*R, z:Z};
}
function project(lat,lon,alt=1){ const p=latlon(lat,lon,alt); return projectXYZ(p[0],p[1],p[2]); }

function lerpLL(a,b,t){
  const A=latlon(a[1],a[0]), B=latlon(b[1],b[0]);
  const d=Math.min(1,Math.max(-1,A[0]*B[0]+A[1]*B[1]+A[2]*B[2]));
  const om=Math.acos(d); if(om<1e-4) return a;
  const s=Math.sin(om), k=Math.sin((1-t)*om)/s, j=Math.sin(t*om)/s;
  const x=A[0]*k+B[0]*j, y=A[1]*k+B[1]*j, z=A[2]*k+B[2]*j;
  return [Math.atan2(z,x)*180/Math.PI, Math.asin(Math.max(-1,Math.min(1,y)))*180/Math.PI];
}

function pathRing(ctx, ring, close){
  const n=ring.length; if(n<2) return 0;
  let pen=false, vis=0;
  ctx.beginPath();
  const last=close?n:n-1;
  for(let i=0;i<last;i++){
    const a=ring[i], b=ring[(i+1)%n];
    const steps=Math.max(1, Math.ceil(Math.hypot(a[0]-b[0], a[1]-b[1])/2.4));
    for(let k=0;k<steps;k++){
      const ll=k?lerpLL(a,b,k/steps):a;
      const p=project(ll[1], ll[0]);
      if(!p){ pen=false; continue; }
      vis++;
      if(!pen){ ctx.moveTo(p.x,p.y); pen=true; } else ctx.lineTo(p.x,p.y);
    }
  }
  return vis;
}

function meridian(lon){
  const r=[]; for(let la=-78;la<=78;la+=3) r.push([lon,la]); return r;
}
function parallel(lat){
  const r=[]; for(let lo=-180;lo<=180;lo+=4) r.push([lo,lat]); return r;
}

function drawGlobe(t){
  if(!glCanvas||!ctx2d) return;
  if(G.auto && !G.dragging && !reduced) G.ry += 0.00045;
  const w=glCanvas.width, h=glCanvas.height;
  const cssW=glCanvas.clientWidth, cssH=glCanvas.clientHeight;
  const dpr=w/Math.max(1,cssW);
  const R=Math.min(cssW,cssH)*0.42*(2.6/G.dist);
  const cx=cssW/2, cy=cssH*0.52;
  ctx2d.setTransform(1,0,0,1,0,0);
  ctx2d.fillStyle="#02060c"; ctx2d.fillRect(0,0,w,h);
  ctx2d.save(); ctx2d.scale(dpr,dpr);

  const halo=ctx2d.createRadialGradient(cx,cy,R*0.82,cx,cy,R*1.28);
  halo.addColorStop(0,"rgba(40,110,220,0)");
  halo.addColorStop(0.62,"rgba(60,140,255,.10)");
  halo.addColorStop(1,"rgba(8,20,40,0)");
  ctx2d.fillStyle=halo; ctx2d.beginPath(); ctx2d.arc(cx,cy,R*1.28,0,7); ctx2d.fill();

  ctx2d.save();
  ctx2d.beginPath(); ctx2d.arc(cx,cy,R,0,7); ctx2d.clip();
  const body=ctx2d.createRadialGradient(cx-R*0.32, cy-R*0.38, R*0.08, cx+R*0.1, cy+R*0.15, R*1.08);
  body.addColorStop(0,"#1c4d7a");
  body.addColorStop(0.22,"#102a48");
  body.addColorStop(0.55,"#0a1c32");
  body.addColorStop(0.82,"#061018");
  body.addColorStop(1,"#03080e");
  ctx2d.fillStyle=body; ctx2d.beginPath(); ctx2d.arc(cx,cy,R,0,7); ctx2d.fill();

  ctx2d.lineJoin="round"; ctx2d.lineCap="butt";
  for(let lo=-180;lo<180;lo+=15){
    const major=lo%30===0, rib=lo%90===0;
    ctx2d.strokeStyle=rib?"rgba(196,165,116,.28)":major?"rgba(120,180,255,.22)":"rgba(80,150,220,.10)";
    ctx2d.lineWidth=rib?1.05:major?0.7:0.4;
    pathRing(ctx2d, meridian(lo), false); ctx2d.stroke();
  }
  for(let la=-75;la<=75;la+=15){
    const eq=la===0, major=la%30===0;
    ctx2d.strokeStyle=eq?"rgba(196,165,116,.38)":major?"rgba(120,180,255,.20)":"rgba(80,150,220,.09)";
    ctx2d.lineWidth=eq?1.15:major?0.7:0.4;
    pathRing(ctx2d, parallel(la), false); ctx2d.stroke();
  }

  ctx2d.fillStyle="rgba(64,130,150,.14)";
  COASTS.forEach(ring=>{ if(pathRing(ctx2d, ring, true)>24){ ctx2d.closePath(); ctx2d.fill(); } });

  ctx2d.lineCap="round";
  ctx2d.strokeStyle="rgba(140,190,220,.28)"; ctx2d.lineWidth=0.55;
  BORDERS.forEach(ring=>{ pathRing(ctx2d, ring, true); ctx2d.stroke(); });

  ctx2d.shadowColor="rgba(130,210,255,.55)"; ctx2d.shadowBlur=3;
  ctx2d.strokeStyle="#9fd4ff"; ctx2d.lineWidth=1.05;
  COASTS.forEach(ring=>{ pathRing(ctx2d, ring, true); ctx2d.stroke(); });
  ctx2d.shadowBlur=0;

  CITIES.forEach(([lo,la])=>{
    const p=project(la,lo); if(!p) return;
    ctx2d.fillStyle="rgba(210,235,255,.85)";
    ctx2d.beginPath(); ctx2d.arc(p.x,p.y,1.15,0,7); ctx2d.fill();
  });
  ctx2d.restore();

  ctx2d.strokeStyle="rgba(160,210,255,.55)"; ctx2d.lineWidth=1.4;
  ctx2d.beginPath(); ctx2d.arc(cx,cy,R,0,7); ctx2d.stroke();
  ctx2d.strokeStyle="rgba(90,160,255,.16)"; ctx2d.lineWidth=7;
  ctx2d.beginPath(); ctx2d.arc(cx,cy,R+1.5,0,7); ctx2d.stroke();
  ctx2d.strokeStyle="rgba(196,165,116,.22)"; ctx2d.lineWidth=0.6;
  ctx2d.beginPath(); ctx2d.arc(cx,cy,R+6,0,7); ctx2d.stroke();
  for(let i=0;i<12;i++){
    const a=i*Math.PI/6, inner=R+4, outer=R+10;
    ctx2d.strokeStyle=i%3===0?"rgba(196,165,116,.4)":"rgba(120,180,255,.2)";
    ctx2d.lineWidth=i%3===0?1:0.5;
    ctx2d.beginPath();
    ctx2d.moveTo(cx+Math.cos(a)*inner, cy+Math.sin(a)*inner);
    ctx2d.lineTo(cx+Math.cos(a)*outer, cy+Math.sin(a)*outer);
    ctx2d.stroke();
  }

  ctx2d.lineCap="round"; ctx2d.lineJoin="round";
  arcs.forEach(a=>{
    ctx2d.beginPath();
    let pen=false, n=a.pts.length/3;
    for(let i=0;i<n;i++){
      const p=projectXYZ(a.pts[i*3], a.pts[i*3+1], a.pts[i*3+2]);
      if(!p){ pen=false; continue; }
      if(!pen){ ctx2d.moveTo(p.x,p.y); pen=true; } else ctx2d.lineTo(p.x,p.y);
    }
    ctx2d.strokeStyle=a.sel?a.col:a.col+"cc";
    ctx2d.shadowColor=a.col; ctx2d.shadowBlur=14;
    ctx2d.setLineDash(a.dashed?[5,6]:[]);
    ctx2d.lineWidth=a.sel?2.3:1.45;
    ctx2d.stroke(); ctx2d.setLineDash([]);
    if(!reduced){
      ctx2d.shadowBlur=0;
      for(let k=0;k<5;k++){
        const u=((t*0.00018*(1+k*0.07)+k/5)%1);
        const i=Math.floor(u*(n-1))*3;
        const p=projectXYZ(a.pts[i],a.pts[i+1],a.pts[i+2]); if(!p) continue;
        ctx2d.fillStyle="#e7f6ff"; ctx2d.beginPath(); ctx2d.arc(p.x,p.y,2.1,0,7); ctx2d.fill();
      }
    }
  });
  ctx2d.restore();
  drawLabels();
}

function bindGlobe(canvas){
  if(!canvas) return;
  glCanvas=canvas;
  resizeGL();
  loadGeo();
  if(!arcs.length) buildArcs();
  canvas.onpointerdown=e=>{ G.dragging=true; G.auto=false; G.lx=e.clientX; G.ly=e.clientY; canvas.setPointerCapture(e.pointerId); };
  canvas.onpointermove=e=>{ if(!G.dragging) return; G.ry+=(e.clientX-G.lx)*0.005; G.rx=Math.max(-1.2,Math.min(1.2,G.rx+(e.clientY-G.ly)*0.005)); G.lx=e.clientX; G.ly=e.clientY; };
  canvas.onpointerup=()=>G.dragging=false;
  canvas.onwheel=e=>{ e.preventDefault(); G.dist=Math.max(1.8,Math.min(4.2,G.dist+e.deltaY*0.002)); };
}

`;
h = h.slice(0, start) + block + h.slice(end);
fs.writeFileSync(path, h);
console.log("spliced", start, end, "newlen", h.length);
