import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function DinoAnimation() {
  const [leftPosition, setLeftPosition] = useState(-100); // Start dino off-screen
  const [isJumping, setIsJumping] = useState(false);
  const [showSign, setShowSign] = useState(true); // Control whether to show the sign image or the running dino

  useEffect(() => {
    // Set a timer to hide the sign after 20 seconds
    const signTimer = setTimeout(() => {
      setShowSign(false);
    }, 6000); // 6 seconds

    // Move dino forward continuously
    const interval = setInterval(() => {
      setLeftPosition((prev) => {
        // If dino moves completely off-screen on the right, reset position and show sign again
        if (prev >= window.innerWidth) {
          return -100; // Reset position to start off-screen
        }
        return prev + 5; // Increment position
      });
    }, 10); // Adjust speed as desired

    // Keydown event to trigger jump
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space" && !isJumping) {
        setIsJumping(true);
        setShowSign(false); // Immediately switch to dino.png when space is pressed
        setTimeout(() => setIsJumping(false), 300); // Duration for jump height
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isJumping, showSign]);

  return (
    <div className="dino-animation">
      <Image
        src={showSign ? "/dino/dino-sign.svg" : "/dino/dino.svg"}
        alt="Dino"
        className={`dino ${isJumping ? "jump" : ""}`}
        style={{
          left: `${leftPosition}px`, // Update left position dynamically
          width: showSign ? "150px" : "100px", // Increase size of dino-sign.svg
          filter: "invert(1)"
        }}
        width={showSign ? 150 : 100}
        height={showSign ? 150 : 100}
      />
    </div>
  );
}
