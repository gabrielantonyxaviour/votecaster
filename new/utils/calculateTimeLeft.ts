import { TimeLeft } from "./types";

export default function calculateTimeLeft(targetTimestamp: Date): TimeLeft {
  const now = new Date();
  const difference = targetTimestamp.getTime() - now.getTime();

  const timeLeft: TimeLeft = {
    total: difference,
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };

  return timeLeft;
}
