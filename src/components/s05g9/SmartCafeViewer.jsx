import { useEffect, useRef, useState } from "react";

const css = `
  .cafe-viewer-root {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
  .cafe-viewer-frame {
    width: 100%;
    height: clamp(320px, 60vw, 560px);
    background: radial-gradient(circle at 50% 40%, #2a1a12 0%, #000 80%);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    overflow: hidden;
    position: relative;
  }
  .cafe-viewer-frame model-viewer {
    width: 100%;
    height: 100%;
    --poster-color: transparent;
  }
  .cafe-viewer-hint {
    font-family: 'Share Tech Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.5px;
    color: #94a3b8;
  }
  .cafe-viewer-loading,
  .cafe-viewer-error {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 24px;
    color: #94a3b8;
    font-family: 'Share Tech Mono', monospace;
    font-size: 13px;
  }
  .cafe-viewer-error {
    color: #f87171;
  }
`;

const MODEL_VIEWER_SRC =
  "https://ajax.googleapis.com/ajax/libs/model-viewer/4.3.1/model-viewer.min.js";

let modelViewerLoadPromise = null;

function loadModelViewerScript() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.customElements && window.customElements.get("model-viewer")) {
    return Promise.resolve();
  }
  if (!modelViewerLoadPromise) {
    modelViewerLoadPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector(
        `script[src="${MODEL_VIEWER_SRC}"]`
      );
      if (existing) {
        existing.addEventListener("load", resolve);
        existing.addEventListener("error", reject);
        return;
      }
      const script = document.createElement("script");
      script.type = "module";
      script.src = MODEL_VIEWER_SRC;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  return modelViewerLoadPromise;
}

export default function SmartCafeViewer({ modelSrc }) {
  const [scriptReady, setScriptReady] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [error, setError] = useState(null);
  const modelRef = useRef(null);

  // Load the model-viewer custom element script
  useEffect(() => {
    let cancelled = false;
    loadModelViewerScript()
      .then(() => {
        if (!cancelled) setScriptReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            "Could not load the 3D viewer library. Check your internet connection."
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Once the custom element exists, attach load/error listeners to the actual model
  useEffect(() => {
    if (!scriptReady || !modelRef.current) return;

    const el = modelRef.current;
    setModelLoaded(false);
    setError(null);

    const handleLoad = () => setModelLoaded(true);
    const handleError = (event) => {
      console.error("model-viewer failed to load model:", event);
      setError(
        `Could not load the 3D model. Check that the file path/import is correct (received: ${
          modelSrc || "no src provided"
        }).`
      );
    };

    el.addEventListener("load", handleLoad);
    el.addEventListener("error", handleError);

    return () => {
      el.removeEventListener("load", handleLoad);
      el.removeEventListener("error", handleError);
    };
  }, [scriptReady, modelSrc]);

  // Catch the case where no src was ever passed in (the most common cause of a "blank" viewer)
  useEffect(() => {
    if (scriptReady && !modelSrc) {
      setError(
        "No model source was provided. Make sure modelSrc is a resolved URL string, not an import object."
      );
    }
  }, [scriptReady, modelSrc]);

  return (
    <div className="cafe-viewer-root">
      <style>{css}</style>
      <div className="cafe-viewer-frame">
        {scriptReady && modelSrc && !error && (
          <model-viewer
            ref={modelRef}
            src={modelSrc}
            alt="A 3D model of the Smart Internet Cafe"
            camera-controls
            auto-rotate
            shadow-intensity="1"
            exposure="1"
          />
        )}
        {(!scriptReady || (scriptReady && modelSrc && !modelLoaded && !error)) && (
          <div className="cafe-viewer-loading">
            {!scriptReady ? "Loading 3D viewer…" : "Loading model…"}
          </div>
        )}
        {error && <div className="cafe-viewer-error">{error}</div>}
      </div>
      <div className="cafe-viewer-hint">
        Drag to rotate • Scroll to zoom • Click and hold to pan
      </div>
    </div>
  );
}