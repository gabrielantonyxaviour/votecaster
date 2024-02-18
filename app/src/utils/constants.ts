import { getDefaultConfig } from "connectkit";
import { createPublicClient, createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { scrollSepolia } from "viem/chains";
import { createConfig, http } from "wagmi";

export const deployment = "0x4ab8f50796b059aE5C8b8534afC6bb4c84912ff6"; //"0x50751BD8d7b0a84c422DE96A56426a370F31a42D";
export const chainId = 534351;
const projectId = process.env["NEXT_PUBLIC_PROJECT_ID"] ?? "";
export const publicClient = createPublicClient({
  chain: scrollSepolia,
  transport: http(),
});
export const relayerAccount = privateKeyToAccount(
  (process.env.PRIVATE_KEY as `0x${string}`) || "0x"
);
export const relayerWalletClient = createWalletClient({
  account: relayerAccount,
  chain: scrollSepolia,
  transport: http("https://sepolia-rpc.scroll.io"),
});
export const config = createConfig(
  getDefaultConfig({
    appName: "Priv Cast",
    walletConnectProjectId: projectId,
    chains: [scrollSepolia],
    ssr: true,
    transports: {
      [scrollSepolia.id]: http("https://rpc.ankr.com/scroll_sepolia_testnet"),
    },
    appDescription:
      "PRIVACY PRESERVED, SYBIL RESISTANT POLLS NOW IN FARCASTER.",
    appUrl: "https://priv-cast.vercel.app", // your app's url
    appIcon: "https://family.co/logo.png",
  })
);
export const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_anonAaadharVerifier",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "pollId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "creatorAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "pollUri",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "createdTimestamp",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "validityDuration",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isAnonAadharEnabled",
        type: "bool",
      },
    ],
    name: "PollCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "pollId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "nullifierHash",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "optionId",
        type: "uint256",
      },
    ],
    name: "VoteCast",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "anonAadhaarNullifier",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "anonAadhaarVerifierAddr",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "proof",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "pollId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "vote",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "nullifierHash",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "identityNullifier",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "userNullifier",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "signal",
            type: "uint256",
          },
          {
            internalType: "uint256[8]",
            name: "groth16Proof",
            type: "uint256[8]",
          },
        ],
        internalType: "struct PrivCast.AnonAadhaarInput",
        name: "anonParams",
        type: "tuple",
      },
    ],
    name: "castVote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "proof",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "pollId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "vote",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "nullifierHash",
        type: "uint256",
      },
    ],
    name: "castVote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "pollUri",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "validityDuration",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isAnonAadharEnabled",
        type: "bool",
      },
    ],
    name: "createPoll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "farcasterNullifiers",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "farcasterVerifier",
    outputs: [
      {
        internalType: "contract UltraVerifier",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "isLessThan3HoursAgo",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pollIdCounter",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "polls",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "pollUri",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "createdTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "validityDuration",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isAnonAadharEnabled",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "isExists",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
