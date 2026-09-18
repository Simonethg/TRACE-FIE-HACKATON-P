import {bundle} from '@remotion/bundler';
import {selectComposition,renderStill,renderMedia} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const text=fs.readFileSync(path.join(root,'src/content.ts'),'utf8');
const contents=text.match(/export const slides = ([\s\S]*?) as const;/)[1];
const slides=Function(`return (${contents})`)();
const starts=slides.map((_,i)=>slides.slice(0,i).reduce((t,s)=>t+s.seconds*30,0));
const notes=['TRACE - Guion de pitch | 3 minutos | Jurado de hackatón','', 'Versión basada en el prototipo del repositorio. Segmento y piloto son propuestas por validar.',''];
let elapsed=0;
for(const [i,s] of slides.entries()){
const stamp=n=>`${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`;
notes.push(`${i+1}. ${s.title.replaceAll('\n',' ')} [${stamp(elapsed)}-${stamp(elapsed+s.seconds)}]`,s.note,'','[Sources]','https://github.com/mindsetwhite/TRACE-FIE-HACKATON-P/tree/main/TRACE','Estado: README.md y SCOPE.md; interfaz: index.html; capturas: docs/qa/.','Las escenas 6, 8 y el llamado al piloto expresan propuestas editoriales.','[/Sources]','');elapsed+=s.seconds;
}
notes.push('PITCH CORTO - 30 segundos','TRACE propone hacer visible adónde van tus datos. Reúne dispositivo, destino y ruta en una experiencia visual para investigar conexiones. Hoy contamos con un prototipo navegable en escritorio y móvil, con tráfico simulado. El siguiente paso es validar la experiencia con usuarios y capturar metadatos en una red autorizada. Buscamos un entorno piloto para hacerlo.','','DEMO EN VIVO - 40 segundos','1. Abrir TRACE en escritorio: presentar mapa e inspector (10 s).','2. Elegir un flujo y mostrar origen, destino y ruta (10 s).','3. Abrir Alerts y el flujo asociado a un destino nuevo (10 s).','4. Aclarar que tráfico, rutas, alertas y controles son demostrativos (10 s).','Si se hace demo en vivo, reemplazar el relato de las escenas 4 y 5; no sumar otros 40 segundos.','','PREGUNTAS DEL JURADO','¿Captura tráfico real? No. Hoy es un prototipo visual con datos simulados.','¿Una alerta prueba un ataque? No. Es una señal para investigar.','¿Puede bloquear tráfico? No en esta versión. El control de bloqueo es demostrativo.','¿Qué sigue? Captura consentida en una red de prueba y validación con usuarios.','¿Cómo se financiaría? No hay un modelo validado en el repositorio. Se puede explorar una suscripción por red o equipo después de validar el problema y la disposición a pagar.','¿Cómo se validará la ruta? Medir la cobertura y expresar explícitamente tramos observados, inferidos y desconocidos.','','[Sources]','Repositorio: https://github.com/mindsetwhite/TRACE-FIE-HACKATON-P','Estado y límites: TRACE/README.md, TRACE/SCOPE.md, TRACE/DEVLOG.md','Experiencia y mock: TRACE/index.html','Capturas: TRACE/docs/qa/desktop-map.png, mobile-flow.png, mobile-alert.png','Implementación de video: https://www.remotion.dev/docs/the-fundamentals','Render: https://www.remotion.dev/docs/render','Hipótesis editoriales: primer usuario, piloto y criterios de éxito. No representan resultados medidos.','[/Sources]');
fs.writeFileSync(path.join(root,'out/TRACE-guion.txt'),notes.join('\n'));
if(process.argv.includes('--notes-only'))process.exit(0);
const serveUrl=await bundle({entryPoint:path.join(root,'src/video.tsx'),publicDir:path.join(root,'public')});
const composition=await selectComposition({serveUrl,id:'TracePitch'});
for(let i=0;i<slides.length;i++){
 await renderStill({composition,serveUrl,frame:starts[i]+40,output:path.join(root,`out/slide-${String(i+1).padStart(2,'0')}.png`)});
 console.log(`Escena ${i+1}/9 renderizada`);
}
if(process.argv.includes('--video')){
let last=-1;
await renderMedia({composition,serveUrl,codec:'h264',outputLocation:path.join(root,'out/TRACE-pitch.mp4'),concurrency:2,onProgress:({progress})=>{const p=Math.floor(progress*10);if(p!==last){last=p;console.log(`Video: ${p*10}%`);}}});
console.log('Video terminado');
}
