export type Poll = {
  question: string;
  options: string[];
  duration: number;
  theme: number;
};

export const POLL_EXPIRY = 60 * 60 * 24 * 180; // Expire polls after 3 months

export type TimeLeft = {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export type Transaction = {
  gas: bigint;
  to: `0x${string}`;
  account: `0x${string}`;
  value: bigint;
  data: `0x${string}`;
};
