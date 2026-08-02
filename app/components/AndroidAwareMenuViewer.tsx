"use client";

import { useEffect, useState } from "react";

type AndroidAwareMenuViewerProps = {
  menuPdfUrl: string;
  viewerUrl: string;
};

export default function AndroidAwareMenuViewer({
  menuPdfUrl,
  viewerUrl,
}: AndroidAwareMenuViewerProps) {
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    setIsAndroid(/Android/i.test(navigator.userAgent));
  }, []);

  if (isAndroid) {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          background: "#f7f1e8",
          padding: "10px",
        }}
        aria-label="Carta gastronómica"
      >
        {[1, 2].map((page) => (
          <img
            key={page}
            src={`/menu/page-${page}.webp`}
            alt={`Carta gastronómica, página ${page}`}
            loading={page === 1 ? "eager" : "lazy"}
            style={{
              display: "block",
              width: "100%",
              height: "auto",
              margin: page === 1 ? "0 auto 12px" : "0 auto",
              background: "white",
              boxShadow: "0 8px 26px rgba(36, 18, 12, 0.15)",
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <iframe
        title="Carta gastronómica en PDF"
        src={viewerUrl}
        className="menu-frame"
        allow="fullscreen"
      />

      <div className="viewer-fallback">
        <p>Tu navegador no pudo mostrar la carta dentro de la página.</p>

        <a href={menuPdfUrl} target="_blank" rel="noreferrer">
          Abrir carta
        </a>
      </div>
    </>
  );
}
