interface QueryResponse {
  data: Data | null;
  loading: boolean;
  error: Error | null;
}

interface Data {
  Wallet: Wallet;
}

interface Error {
  message: string;
}

interface Wallet {
  socials: Social[];
  addresses: string[];
}

interface Social {
  dappName: "lens" | "farcaster";
  profileName: string;
}

export type { QueryResponse, Data, Error, Wallet, Social };
