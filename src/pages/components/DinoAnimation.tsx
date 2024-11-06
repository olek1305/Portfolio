import React, { useEffect, useState } from "react";

export default function DinoAnimation() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="dino-animation">
      <div className="ground"></div>
      <img
        src="/dino.png"
        alt="Dino"
        className={`dino ${animate ? "animate-run" : ""}`}
      />
    </div>
  );
}
