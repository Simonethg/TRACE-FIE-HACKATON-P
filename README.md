<p align="center">
  <img src="docs/logo.png" alt="TRACE" width="88" />
</p>

<p align="center">
  <sub>TRACE · FIE HACKATÓN · PROTOTIPO</sub>
</p>

<h1 align="center">Tus datos salen.<br/>¿Sabés adónde?</h1>

<p align="center">
  TRACE hace visible el recorrido de tus conexiones.<br/>
  Dispositivo, destino y ruta, en una sola vista.
</p>

<p align="center">
  <a href="https://trace-app-bay.vercel.app/"><strong>Abrir la demo →</strong></a>
  &nbsp;·&nbsp;
  <a href="#cómo-abrirlo">Correrlo en local</a>
  &nbsp;·&nbsp;
  <a href="docs/pitch">Deck y guion</a>
</p>

<p align="center">
  <img src="TRACE/docs/qa/desktop-map.png" alt="Control room TRACE: globo, flujos y inspector" width="920" />
</p>

---

<p align="center"><sub>01 / 09 · VISIBILIDAD DE RED</sub></p>

## Todos los días, datos que no vemos

Los dispositivos se conectan a servicios que no aparecen en ninguna vista clara. Cuando surge una conexión desconocida, la pregunta es simple: **adónde están yendo mis datos**.

TRACE nace para hacer visible ese recorrido y ayudar a decidir qué merece atención.

---

<p align="center"><sub>02 / 09 · EL PROBLEMA</sub></p>

<h2 align="center">Una conexión sin contexto<br/>es una pregunta sin respuesta.</h2>

<p align="center">¿Qué dispositivo? ¿Qué destino? ¿Qué cambió?</p>

| | | |
| :--- | :--- | :--- |
| **01 · Origen** | **02 · Destino** | **03 · Cambio** |
| El dispositivo que inició la conexión. | El servicio o la organización de destino. | La señal que merece una revisión. |

Una IP o una lista de paquetes no alcanzan. Hay que relacionar dispositivo, destino y evento en una vista que se pueda investigar.

---

<p align="center"><sub>03 / 09 · LA PROPUESTA</sub></p>

<h2 align="center">El recorrido, en una sola vista.</h2>

<p align="center">Explorá el mapa. Elegí un flujo. Abrí su contexto.</p>

<p align="center">
  <img src="TRACE/docs/qa/desktop-map.png" alt="Mapa TRACE con arco de flujo entre Buenos Aires y Miami" width="920" />
</p>

El inspector reúne origen, destino, protocolo y ruta. El prototipo se explora en escritorio y en móvil. **El tráfico que ves hoy es simulado:** mostramos la experiencia, todavía no una herramienta conectada a una red real.

---

<p align="center"><sub>04 / 09 · DEMO · EXPLORAR</sub></p>

<h2 align="center">Cada flujo tiene una historia.</h2>

<p align="center">
  <img src="TRACE/docs/qa/mobile-flow.png" alt="Detalle de flujo: dispositivo, hops y destino" width="280" />
</p>

Seleccionás una conexión y ves de qué dispositivo sale, hacia dónde va y los saltos de la ruta. La interfaz distingue tramos **observados**, **inferidos** y **desconocidos**. En el producto hay que validar qué se puede medir y con qué confianza, sin prometer visibilidad que no tenemos.

---

<p align="center"><sub>05 / 09 · DEMO · INVESTIGAR</sub></p>

<h2 align="center">Una alerta abre la investigación.</h2>

<p align="center">Nuevo destino → dispositivo → flujo asociado.</p>

<p align="center">
  <img src="TRACE/docs/qa/mobile-home.png" alt="Home móvil TRACE" width="240" />
  &nbsp;&nbsp;
  <img src="TRACE/docs/qa/mobile-alert.png" alt="Alerta de nuevo destino" width="240" />
</p>

Un destino desconocido **no demuestra un ataque**: es una señal para investigar. Las alertas y el botón de bloqueo son demostrativos; todavía no detectan ni cortan tráfico real.

---

<p align="center"><sub>06 / 09 · PRIMER USUARIO · HIPÓTESIS</sub></p>

<h2 align="center">“¿Qué dispositivo se conectó<br/>a este destino?”</h2>

<p align="center">Empezar por quien necesita investigar:<br/>responsables de redes pequeñas y equipos técnicos.</p>

El caso inicial es concreto: identificar el dispositivo que originó una conexión y revisar el destino. Antes de ampliar el producto, hay que comprobar si esta experiencia se entiende y si reduce el tiempo para encontrar ese contexto.

---

<p align="center"><sub>07 / 09 · ESTADO DEL PROYECTO</sub></p>

<h2 align="center">Una experiencia que ya podemos poner a prueba.</h2>

<p align="center">
  <img src="TRACE/docs/qa/desktop-devices.png" alt="Tabla de dispositivos en el control room" width="920" />
</p>

| Hoy | Siguiente hito |
| :--- | :--- |
| Mapa e inspector de flujos | Captura real consentida |
| Dispositivos y alertas | Backend y autenticación |
| Datos simulados, `localStorage` | Validación con usuarios |

X-Ray, Packets y Reports son shells. Devices y layers se guardan en el navegador (`trace.devices`, `trace.layers`).

---

<p align="center"><sub>08 / 09 · PRÓXIMO EXPERIMENTO</sub></p>

<h2 align="center">Validar con una red real.</h2>

| | | |
| :--- | :--- | :--- |
| **01 · Capturar** | **02 · Interpretar** | **03 · Medir** |
| Metadatos en una red autorizada. | Dispositivo, destino y certeza de la ruta. | Tiempo de investigación y utilidad de las alertas. |

Son criterios propuestos. Todavía no hay resultados de un piloto.

---

<p align="center"><sub>09 / 09 · TRACE</sub></p>

<h1 align="center">Ver el recorrido.<br/>Entender la conexión.</h1>

<p align="center">
  Buscamos un entorno piloto y usuarios para validar el siguiente paso con tráfico real.
</p>

<p align="center">
  <a href="https://trace-app-bay.vercel.app/"><strong>→ Probar el prototipo</strong></a>
</p>

## Cómo abrirlo

<details>
<summary><strong>Correrlo en local</strong></summary>

```bash
cd TRACE
python -m http.server 4173
```

Abrí [http://127.0.0.1:4173](http://127.0.0.1:4173). Hace falta HTTP local: `geo.js` no carga bien como `file://`. Escritorio ≥900px → control room. Más angosto → Home / Map / Devices / Alerts. El detalle alto del globo pide red; sin red queda el mapa 110m empaquetado.

</details>

<details>
<summary><strong>Qué es y qué no es</strong></summary>

| | |
| :--- | :--- |
| **Es** | Prototipo visual navegable. Un `index.html` + `geo.js`. Cero backend. |
| **No es** | Captura real, detección de ataques, bloqueo efectivo, producto en producción. |
| **Stack** | Canvas 2D (no Three.js). Hash routes. Mock de tráfico. |
| **Pitch** | [`docs/pitch`](docs/pitch) — deck PDF, guion y reproductor. |

</details>
