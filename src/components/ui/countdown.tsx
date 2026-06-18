"use client";

import { useEffect, useState } from "react";

/** Live countdown to a target datetime (legacy Countdown). */
export function Countdown({ time }: { time: string }) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    const target = new Date(time).getTime();
    const tick = () => {
      const total = target - Date.now();
      if (total <= 0) {
        setLabel("Now");
        return false;
      }
      const s = Math.floor((total / 1000) % 60);
      const m = Math.floor((total / 1000 / 60) % 60);
      const h = Math.floor((total / 1000 / 60 / 60) % 24);
      const d = Math.floor(total / 1000 / 60 / 60 / 24);
      const pad = (n: number) => (n > 9 ? `${n}` : `0${n}`);
      setLabel(`${d > 0 ? `${d}d ` : ""}${pad(h)}:${pad(m)}:${pad(s)}`);
      return true;
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [time]);

  return <span>{label}</span>;
}
