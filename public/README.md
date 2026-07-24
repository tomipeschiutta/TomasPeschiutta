# Portafolio — Tomás Peschiutta

Sitio estático sin build step: HTML + CSS + JavaScript (módulos ES nativos).
Se despliega tal cual está, sin `npm install` ni compilación.

## Estructura

```
public/
├── index.html              Estructura y textos por defecto (español)
├── 404.html
├── robots.txt / sitemap.xml
├── data/
│   ├── projects.json       ← LOS PROYECTOS SE EDITAN ACÁ
│   └── site.json           ← Stack y formación/experiencia
├── languages/
│   ├── es.json             Textos fijos en español
│   └── en.json             Textos fijos en inglés
└── assets/
    ├── css/main.css        Todo el CSS, con variables de tema
    ├── js/
    │   ├── main.js         Punto de entrada
    │   ├── i18n.js         Traducciones
    │   ├── ui.js           Tema, menú, scroll, animaciones
    │   ├── content.js      Render de stack y formación
    │   ├── projects.js     Render de proyectos + modal
    │   └── form.js         Formulario de contacto
    └── images/
```

## Cómo agregar un proyecto

Todo sale de `data/projects.json`. **No hace falta tocar HTML ni JS.**

1. Copiá uno de los bloques con `"draft": true` (son plantillas).
2. Cambiá el `"id"` por uno único.
3. Completá los campos. Los que son `{ "es": ..., "en": ... }` son bilingües.
4. Poné `"draft": false` para que aparezca en el sitio.

Campos:

| Campo        | Qué es                                                              |
|--------------|---------------------------------------------------------------------|
| `id`         | Identificador único, sin espacios                                   |
| `draft`      | `true` = oculto en el sitio                                         |
| `year`       | Se muestra como etiqueta sobre la imagen                            |
| `tags`       | Filtros: `web`, `mobile`, `backend`, `data`, `desktop`              |
| `cover`      | Imagen de la tarjeta (se recorta a 16:10)                           |
| `title`      | Nombre del proyecto                                                 |
| `context`    | Línea corta arriba del título, ej. "Sistema interno · Multiplataforma" |
| `summary`    | 2-3 frases sobre el problema que resuelve                           |
| `role`       | Tu rol en el proyecto                                               |
| `stack`      | Lista de tecnologías (no se traduce). En la tarjeta se ven las 4 primeras |
| `highlights` | Puntos técnicos que se muestran en el modal                         |
| `links`      | Botones del modal. `type`: `repo` o `demo`. Lista vacía = sin botones |
| `gallery`    | Capturas del modal, cada una con título y descripción               |

Si agregás un tag nuevo, sumalo también a `projects.filters` en `languages/es.json`
y `languages/en.json`, y a `TAG_ORDER` en `assets/js/projects.js`.

## Stack y formación

Se editan en `data/site.json`.
En `timeline`, `type` puede ser `"work"` (experiencia) o `"education"` (formación),
y `"draft": true` oculta la entrada. Hay una entrada de trabajo en borrador lista para completar.

## Textos fijos

Están en `languages/es.json` y `languages/en.json`. En el HTML se enganchan con
`data-i18n="ruta.a.la.clave"`. Los dos archivos tienen que tener las mismas claves.

## Formulario de contacto

Por defecto abre el cliente de correo del visitante con el mensaje ya armado.
Para recibir los mensajes directo en tu casilla, creá un formulario gratis en
[Formspree](https://formspree.io) o [Web3Forms](https://web3forms.com) y pegá la URL
en la constante `ENDPOINT` de `assets/js/form.js`.

## Desarrollo local

Los módulos ES y los `fetch()` necesitan un servidor; abrir `index.html` con doble
clic no funciona.

```bash
npx serve public        # o
firebase serve          # o
python -m http.server 8000 --directory public
```

## Deploy

```bash
firebase deploy --only hosting
```

## Tema e idioma

Se guardan en `localStorage` (`tp-theme`, `tp-lang`). El primer ingreso usa la
preferencia del sistema para el tema y el idioma del navegador para el texto.
