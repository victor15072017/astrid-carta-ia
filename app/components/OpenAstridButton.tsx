"use client";

export default function OpenAstridButton() {
  function openAstrid() {
    window.dispatchEvent(new Event("open-astrid-chat"));
  }

  return (
    <button type="button" className="astrid-top-button" onClick={openAstrid}>
      Preguntar a Astrid
    </button>
  );
}
