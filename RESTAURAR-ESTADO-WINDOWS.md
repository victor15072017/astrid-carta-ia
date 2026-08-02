# Restaurar Astrid Carta IA al estado estable de Windows

Este paquete restaura la interfaz con el PDF embebido mediante iframe, el diseño anterior, el generador QR y la burbuja de Astrid.

## Copiar

Copia la carpeta `app` sobre:

`C:\Users\51997\proyectos\astrid-carta-ia\app`

Acepta reemplazar todos los archivos.

## Eliminar archivos de los intentos posteriores

En PowerShell, dentro del proyecto, ejecuta:

```powershell
Remove-Item -Force app\components\MenuPdfViewer.tsx -ErrorAction SilentlyContinue
Remove-Item -Force app\components\PdfDocumentView.tsx -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force app\api\menu-pdf -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force app\api\health -ErrorAction SilentlyContinue
Remove-Item -Force lib\menu-data.ts -ErrorAction SilentlyContinue
npm uninstall react-pdf
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm run dev -- --hostname 0.0.0.0
```

No se modifica `.env.local`.
