"use client";

import { useId, useState } from "react";
import Link from "next/link";
import styles from "./AstridTopAccess.module.css";

// Her anatomical left forearm is on the viewer's right. Both layers use
// the same artwork: the face stays still and the waving arm never swaps.
const LEFT_FOREARM = "M690 0H1000V740H904L864 727 816 705 781 674 767 653H690Z";
const ARTWORK = "/astrid/avatar-left-hand.png";

export default function AstridTopAccess() {
  const id = useId().replace(/:/g, "");
  const [dismissed, setDismissed] = useState(false);

  return (
    <Link
      href="/astrid"
      className={styles.access}
      aria-label="Conversar con Astrid"
      data-dismissed={dismissed}
      onPointerEnter={() => setDismissed(false)}
      onFocus={() => setDismissed(false)}
      onKeyDown={(event) => {
        if (event.key === "Escape") setDismissed(true);
      }}
    >
      <span className={styles.tooltip} aria-hidden="true">
        Conversar con Astrid
      </span>
      <svg className={styles.avatar} viewBox="0 0 1000 1000" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id={`${id}-circle`}>
            <circle cx="490" cy="495" r="455" />
          </clipPath>
          <clipPath id={`${id}-arm`}>
            <path d={LEFT_FOREARM} />
          </clipPath>
          <mask id={`${id}-body`} maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="1000">
            <rect width="1000" height="1000" fill="white" />
            <path d={LEFT_FOREARM} fill="black" />
          </mask>
        </defs>
        <circle cx="490" cy="495" r="455" fill="#59162c" stroke="#c4a16a" strokeWidth="18" />
        <g clipPath={`url(#${id}-circle)`}>
          <image href={ARTWORK} width="1000" height="1000" mask={`url(#${id}-body)`} />
        </g>
        <g className={styles.leftArm}>
          <image href={ARTWORK} width="1000" height="1000" clipPath={`url(#${id}-arm)`} />
        </g>
      </svg>
    </Link>
  );
}
