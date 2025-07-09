// components/ConfettiEffect.jsx
import { useCallback, useEffect, useState } from "react";
import Particles from "@tsparticles/react";
import { loadSlim  } from "@tsparticles/slim";

export default function ConfettiEffect() {
  const [active, setActive] = useState(true);

  const particlesInit = useCallback(async (engine) => {
    await loadConfettiPreset(engine);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setActive(false), 10000); // stop after 10 seconds
    return () => clearTimeout(timer);
  }, []);

  if (!active) return null;

  return (
    <Particles
      id="confetti"
      init={particlesInit}
      options={{
        preset: "confetti",
        fullScreen: { enable: true, zIndex: 20 }, // above bg but below UI
      }}
    />
  );
}