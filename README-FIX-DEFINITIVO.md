# Corrección definitiva: carta + Astrid

Esta versión elimina por completo el iframe y React-PDF.
La carta se muestra como HTML adaptable a Safari, Chrome, Windows y celulares.
Astrid usa la misma información estructurada de la carta y ya no envía el PDF a OpenAI.

## Reemplazar

Copia estas carpetas y archivos en la raíz de `astrid-carta-ia`:

- app/page.tsx
- app/globals.css
- app/components/AstridChat.tsx
- app/components/OpenAstridButton.tsx
- app/api/chat/route.ts
- app/api/health/route.ts
- lib/menu-data.ts

## Configuración

Crea o revisa `.env.local`:

OPENAI_API_KEY=TU_CLAVE_REAL
OPENAI_MODEL=gpt-5.6-luna
NEXT_PUBLIC_MENU_PDF_URL=https://astridygaston.com/cartas/AG-carta-web-27.08.pdf

## Reinicio limpio

En PowerShell:

Ctrl + C
Remove-Item -Recurse -Force .next
npm run dev -- --hostname 0.0.0.0

## Pruebas

1. En la computadora: http://localhost:3000
2. Diagnóstico: http://localhost:3000/api/health
3. En el celular por Wi-Fi: http://TU-IP:3000
4. Pulsa la burbuja A y pregunta: `Tengo S/ 100 y quiero carne`.

La ruta `/api/health` debe indicar `openaiKeyConfigured: true`.
