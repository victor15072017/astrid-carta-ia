"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function QrPage() {
  const [destination, setDestination] = useState("");

  useEffect(() => {
    // Al abrir /qr, utiliza inicialmente la dirección actual.
    setDestination(window.location.origin);
  }, []);

  function downloadQr() {
    const svg = document.querySelector(
      "#astrid-qr svg",
    ) as SVGElement | null;

    if (!svg) {
      return;
    }

    const serializedSvg =
      new XMLSerializer().serializeToString(svg);

    const svgWithDeclaration = `<?xml version="1.0" encoding="UTF-8"?>\n${serializedSvg}`;

    const blob = new Blob([svgWithDeclaration], {
      type: "image/svg+xml;charset=utf-8",
    });

    const objectUrl = URL.createObjectURL(blob);

    const downloadLink = document.createElement("a");

    downloadLink.href = objectUrl;
    downloadLink.download = "astrid-carta-qr.svg";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();

    URL.revokeObjectURL(objectUrl);
  }

  const cleanDestination = destination.trim();

  return (
    <main className="qr-page">
      <section className="qr-card">
        <p className="qr-eyebrow">Acceso directo</p>

        <h1>Escanea la carta con Astrid</h1>

        <p className="qr-description">
          Este QR abre la carta digital y mantiene disponible el
          acceso a Astrid.
        </p>

        <div id="astrid-qr" className="qr-box">
          {cleanDestination ? (
            <QRCodeSVG
              value={cleanDestination}
              size={260}
              level="H"
              bgColor="#fffaf2"
              fgColor="#541426"
              title="QR para abrir la carta con Astrid"
            />
          ) : (
            <p>Ingresa una dirección para generar el QR.</p>
          )}
        </div>

        <label htmlFor="qr-destination">
          Dirección que abrirá el QR
        </label>

        <input
          id="qr-destination"
          type="url"
          value={destination}
          onChange={(event) =>
            setDestination(event.target.value)
          }
          placeholder="http://192.168.1.96:3000"
          autoComplete="off"
          spellCheck={false}
        />

        <div className="qr-actions">
          <button
            type="button"
            onClick={downloadQr}
            disabled={!cleanDestination}
          >
            Descargar QR en SVG
          </button>

          <Link href="/">Volver a la carta</Link>
        </div>

        <p className="qr-help">
          Para probar desde un celular conectado al mismo Wi-Fi,
          utiliza la dirección Network mostrada por Next.js. Para
          imprimir el QR definitivo, utiliza la dirección pública del
          proyecto cuando lo publiquemos.
        </p>
      </section>
    </main>
  );
}