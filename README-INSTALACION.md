# Proyecto 3: Carta + burbuja de IA “Astrid”

Este paquete se copia dentro de un proyecto nuevo de Next.js.

## 1. Crear el tercer proyecto

```powershell
cd C:\Users\51997\proyectos
npx create-next-app@latest astrid-carta-ia
```

## 2. Reemplazar archivos

Descomprime este ZIP y copia las carpetas/archivos dentro de:

```text
C:\Users\51997\proyectos\astrid-carta-ia
```

Acepta reemplazar `app/page.tsx`, `app/layout.tsx` y `app/globals.css`.

## 3. Instalar dependencias

```powershell
cd C:\Users\51997\proyectos\astrid-carta-ia
npm install openai qrcode.react
```

No ejecutes `npm audit fix --force` automáticamente.

## 4. Configurar la clave

Copia `.env.local.example` como `.env.local` y reemplaza:

```env
OPENAI_API_KEY=pega_aqui_tu_clave
```

No compartas ni subas `.env.local` a GitHub.

## 5. Ejecutar

```powershell
npm run dev
```

Rutas:

- `http://localhost:3000` — carta PDF con burbuja de Astrid.
- `http://localhost:3000/qr` — generador del QR.

## 6. Probar el QR en el celular

Mientras ambos dispositivos estén en la misma red Wi-Fi, usa en `/qr` la dirección “Network” que muestra Next.js, por ejemplo:

```text
http://192.168.1.96:3000
```

Para un QR definitivo, despliega en Vercel y coloca la URL pública.

## Funcionamiento de la IA

En la primera consulta, el backend entrega a OpenAI la URL oficial del PDF como `input_file`. La API extrae el texto de la carta. Las siguientes consultas reutilizan el identificador de la respuesta para conservar la conversación y evitar reenviar el PDF en cada mensaje.

## Avisos

- Es una propuesta conceptual no oficial.
- La IA no debe confirmar alergias ni disponibilidad; siempre debe derivar esas verificaciones al personal.
- Antes de una publicación comercial, solicita autorización para utilizar nombre, identidad, fotografías o documentos de terceros.
