# TRACE — pitch y deck con Remotion

Nueve escenas en español, 1920 × 1080, 30 fps, 3 minutos. Preparado para un jurado de hackatón. La audiencia se asumió por el contexto del repositorio.

## Abrir y presentar

```sh
cd docs/pitch
npm ci
npm run dev
```

Abrir la dirección local que indica Vite. Navegación manual con ← / →; Espacio reproduce o pausa; F abre pantalla completa; N muestra el guion. El botón Guion contiene las notas de cada escena. La reproducción automática sirve como apoyo a una narración en vivo; el MP4 no incluye voz ni música.

## Entregables

- `out/TRACE-pitch.mp4`: deck animado de tres minutos.
- `out/TRACE-deck.pdf`: nueve diapositivas estáticas.
- `out/TRACE-guion.txt`: guion por escena, pitch de 30 segundos, recorrido de demo y respuestas para el jurado.

## Editar

- `src/content.ts`: títulos, notas y tiempos.
- `src/Deck.tsx`: escenas, diseño y animación.
- `src/main.tsx`: reproductor y controles.
- `public/`: capturas originales del prototipo.

```sh
npm run studio
npm run check
npm run build
node scripts/export.mjs --video
python3 scripts/export-pdf.py
```

El script de exportación usa Remotion para todas las escenas y el MP4. El PDF requiere Python y reportlab. El primer render puede descargar Chrome Headless Shell. Se necesita permiso para levantar un servidor de render local.

## Base factual

Fuente: https://github.com/mindsetwhite/TRACE-FIE-HACKATON-P

La versión revisada es un **prototipo visual**, sin captura real de tráfico, backend, autenticación o bloqueo efectivo. Las rutas, métricas y alertas son mock. El segmento inicial, el piloto y las métricas de validación son propuestas editoriales, no evidencia de tracción. No se inventaron usuarios, resultados comerciales ni cifras de mercado.

Las capturas provienen de `TRACE/docs/qa/`. La pantalla móvil de alerta conserva el recorte que existe en la captura original del repositorio.

Documentación de implementación: https://www.remotion.dev/docs/the-fundamentals y https://www.remotion.dev/docs/render.
