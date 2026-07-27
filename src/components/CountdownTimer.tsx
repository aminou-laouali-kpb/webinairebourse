import { useEffect, useState } from "react";

const DEADLINE_KEY = "kpb_offer_deadline";
const OFFER_DURATION_MS = 24 * 60 * 60 * 1000; // 24h

function getDeadline(): number {
  const stored = localStorage.getItem(DEADLINE_KEY);
  const parsed = stored ? Number(stored) : NaN;
  if (!Number.isNaN(parsed) && parsed > Date.now()) return parsed;
  const next = Date.now() + OFFER_DURATION_MS;
  localStorage.setItem(DEADLINE_KEY, String(next));
  return next;
}

function format(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    hours: String(Math.floor(total / 3600)).padStart(2, "0"),
    minutes: String(Math.floor((total % 3600) / 60)).padStart(2, "0"),
    seconds: String(total % 60).padStart(2, "0"),
  };
}

interface CountdownTimerProps {
  variant?: "full" | "compact";
}

export const CountdownTimer = ({ variant = "full" }: CountdownTimerProps) => {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const deadline = getDeadline();
    const tick = () => setRemaining(deadline - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (remaining === null) return null;
  const { hours, minutes, seconds } = format(remaining);

  if (variant === "compact") {
    return (
      <span className="font-mono font-bold tabular-nums">
        {hours}:{minutes}:{seconds}
      </span>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2" aria-live="off">
      {[
        { value: hours, label: "heures" },
        { value: minutes, label: "min" },
        { value: seconds, label: "sec" },
      ].map((unit) => (
        <div
          key={unit.label}
          className="bg-blue-dark text-primary-foreground rounded-xl px-3 py-2 min-w-[64px] text-center"
        >
          <p className="text-2xl font-black font-mono tabular-nums leading-none">{unit.value}</p>
          <p className="text-[10px] uppercase tracking-wide opacity-70 mt-1">{unit.label}</p>
        </div>
      ))}
    </div>
  );
};
