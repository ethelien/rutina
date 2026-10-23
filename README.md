# Rutina · Carrera y Hyrox

App web instalable (PWA) para seguir una rutina de 12 semanas de pliometría, fuerza de pierna y agarre, registrar entrenos Hyrox (leyendo una foto de la pizarra) y carreras.

- Funciona sin conexión una vez instalada.
- Los datos se guardan solo en el móvil (localStorage). Nada se envía a ningún servidor.
- Las fotos se leen en el propio móvil con [Tesseract.js](https://github.com/naptha/tesseract.js) y se descartan al momento: no se guardan.

## Instalar en Android

1. Abre la dirección de GitHub Pages en Chrome.
2. Menú ⋮ → **Instalar aplicación** (o «Añadir a pantalla de inicio»).
3. Ábrela una vez con internet para que descargue el lector de fotos.

## Cambiar la rutina

Los ejercicios, series, vídeos y grupos musculares están en `data.js`.
Al publicar cambios, sube también el número de `CACHE` en `sw.js` para que el móvil descargue la versión nueva.

## Licencias

Tesseract.js y tesseract.js-core: Apache 2.0 (ver `vendor/tesseract`). Datos de idioma de Tesseract: Apache 2.0.
