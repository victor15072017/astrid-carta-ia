import AstridChat from "./components/AstridChat";
import AstridTopAccess from "./components/AstridTopAccess";
import ChromeAstridBubble from "./components/ChromeAstridBubble";
import AndroidAwareMenuViewer from "./components/AndroidAwareMenuViewer";

const MENU_PDF_URL =
  process.env.NEXT_PUBLIC_MENU_PDF_URL ||
  "https://astridygaston.com/cartas/A&G_Carta_Web_ES.pdf";

export default function Home() {
  const viewerUrl = `${MENU_PDF_URL}#toolbar=1&navpanes=0&view=FitH`;

  return (
    <main className="menu-app">
      <header className="topbar">
        <div className="brand-block">
          <p>Propuesta conceptual no oficial</p>
          <h1>Carta gastronómica</h1>
        </div>

        <div className="topbar-actions">
          <AstridTopAccess />
        </div>
      </header>

      <section
  className="viewer-shell"
  aria-label="Carta del restaurante"
>
  <AndroidAwareMenuViewer
    menuPdfUrl={MENU_PDF_URL}
    viewerUrl={viewerUrl}
  />
</section>

      <AstridChat />
      <ChromeAstridBubble />
    </main>
  );
}