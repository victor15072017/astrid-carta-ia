import styles from "./ResponsiveMenuViewer.module.css";

type ResponsiveMenuViewerProps = {
  viewerUrl: string;
  menuPdfUrl: string;
};

export default function ResponsiveMenuViewer({
  viewerUrl,
  menuPdfUrl,
}: ResponsiveMenuViewerProps) {
  return (
    <div className={styles.root}>
      <div className={styles.desktopViewer}>
        <iframe
          title="Carta gastronómica en PDF"
          src={viewerUrl}
          className={styles.frame}
          allow="fullscreen"
        />
      </div>

      <div
        className={styles.mobileViewer}
        aria-label="Carta gastronómica completa"
      >
        <img
          src="/menu/page-1.webp"
          alt="Carta gastronómica, página 1 de 2"
          className={styles.pageImage}
          loading="eager"
          decoding="async"
        />

        <img
          src="/menu/page-2.webp"
          alt="Carta gastronómica, página 2 de 2"
          className={styles.pageImage}
          loading="eager"
          decoding="async"
        />

        <a
          href={menuPdfUrl}
          target="_blank"
          rel="noreferrer"
          className={styles.originalLink}
        >
          Abrir PDF original
        </a>
      </div>
    </div>
  );
}
