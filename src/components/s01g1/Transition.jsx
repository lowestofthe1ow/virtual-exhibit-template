import { useState } from "react";
import "../../styles/s01g1.css";

export default function WarpTransition({ href, destination, children }) {
  const [warp, setWarp] = useState(false);

  function travel(e) {
    e.preventDefault();

    setWarp(true);

    setTimeout(() => {
      window.location.href = href;
    }, 2500);
  }

  return (
    <>
      <a href={href} onClick={travel}>
        {children}
      </a>

      {warp && (
        <div className="warp">
          <div className="warp-text">
            <div className="small">Traveling to</div>
            <div className="big">{destination}</div>
          </div>

          {Array.from({ length: 50 }).map((_, i) => (
            <span
              key={i}
              className="star"
              style={{
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.3}s`,
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
