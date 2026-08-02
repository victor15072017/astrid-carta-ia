"use client";

import { useEffect, useState } from "react";

function isGoogleChrome(): boolean {
  const userAgent = navigator.userAgent;
  const vendor = navigator.vendor;

  const isChrome =
    userAgent.includes("Chrome/") &&
    vendor.includes("Google");

  const excludedBrowser =
    userAgent.includes("Edg/") ||
    userAgent.includes("OPR/") ||
    userAgent.includes("SamsungBrowser/") ||
    userAgent.includes("CriOS/") ||
    /iPhone|iPad|iPod/i.test(userAgent);

  return isChrome && !excludedBrowser;
}

export default function ChromeAstridBubble() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(isGoogleChrome());
  }, []);

  function openAstridChat() {
    window.dispatchEvent(new Event("open-astrid-chat"));
  }

  if (!visible) {
    return null;
  }

  return (
    <button
      type="button"
      className="chat-launcher"
      onClick={openAstridChat}
      aria-label="Conversar con Astrid"
    >
      <span className="launcher-avatar">A</span>

      <span className="launcher-copy">
        <strong>¿Necesitas ayuda?</strong>
        <small>Conversa con Astrid</small>
      </span>
    </button>
  );
}