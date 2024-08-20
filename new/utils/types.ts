export type Poll = {
  question: string;
  options: string[];
  duration: number;
  theme: number;
  proofOfHumanity: boolean;
};

export const POLL_EXPIRY = 60 * 60 * 24 * 180; // Expire polls after 3 months
