# TRACE

See where your data goes.

Demo visual **PROTOTYPE** del control room TRACE: mapa 3D, flujos, paquetes, devices y alertas. No es el producto ni un backend real. Sirve para pitch y para alinear al equipo sobre la UI.

**Demo:** [https://trace-app-bay.vercel.app/](https://trace-app-bay.vercel.app/)

**Stack:** un `index.html` + `geo.js`. Cero build, cero servidor de app, cero auth.

## Cómo abrirlo

Hace falta un HTTP local. `geo.js` no carga bien como `file://`.

```bash
cd TRACE
python -m http.server 4173
```

Abrí [http://127.0.0.1:4173](http://127.0.0.1:4173).

Desktop ≥900px → control room. Más angosto → Home / Map / Devices / Alerts.

## Qué hay en el demo

| Superficie | Qué probar |
|---|---|
| Map | Globo, arcs de flujo, inspector, layers, zoom/drag |
| X-Ray / Packets / Reports | Shells con datos mock |
| Devices | CRUD en memoria (`localStorage`) |
| Alerts | Drill-down a flujo |
| Mobile | Home, flow, alerta |

Datos de tráfico, hops y destinos son **mock**. Devices y layers se guardan en `localStorage` (`trace.devices`, `trace.layers`).

## Globo

Canvas 2D (no Three.js). Costas empaquetadas en `geo.js` (Natural Earth 110m). Al hacer zoom pide más detalle por CDN:

- [world-atlas](https://github.com/topojson/world-atlas) 50m / 10m
- REST Countries (nombres de países ONU, ES)
- geoBoundaries ADM1/ADM2 en super zoom

**Etiquetas:** países primero; capitales, provincias, estados y municipios recién en super zoom. Cartografía de trabajo: ONU + OEA (Islas Malvinas como AR).

**Controles:** rueda = zoom (no gira). Drag = arrastrar el planeta. Flick = inercia. `+` / `−` / `↺` en el mapa.

Hace falta **red** para el detalle alto. Sin red queda el 110m local.

## Archivos

```
index.html      app (UI + globo + mock)
geo.js          costas/bordes 110m
SCOPE.md        contrato del MVP
DEVLOG.md       bitácora
docs/qa/        screenshots de referencia
```

## Fuera de alcance

Auth, captura real de tráfico, API, persistencia de servidor, deploy de producción.

## Estado

PROTOTYPE — 2026-09-17. Contrato visual: sprint anchor TRACE (desktop + mobile).
