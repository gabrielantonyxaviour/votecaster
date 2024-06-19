import { getDefaultConfig } from "connectkit";
import { createPublicClient, createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { createConfig, http } from "wagmi";

export const deployment = "0xc6b011774FE1393AE254d19456e76F0f1b5B09Eb";
export const chainId = 534351;
const projectId = process.env["NEXT_PUBLIC_PROJECT_ID"] ?? "";
const sepoliaRpcUrl = process.env["NEXT_PUBLIC_SEPOLIA_RPC_URL"] ?? "";
export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});
const privateKey: `0x${string}` =
  (process.env.NEXT_PUBLIC_PRIVATE_KEY as `0x${string}`) ||
  ("0x" as `0x${string}`);
export const relayerAccount = privateKeyToAccount(privateKey);
export const relayerWalletClient = createWalletClient({
  account: relayerAccount,
  chain: baseSepolia,
  transport: http(sepoliaRpcUrl),
});
export const config = createConfig(
  getDefaultConfig({
    appName: "Priv Cast",
    walletConnectProjectId: projectId,
    chains: [baseSepolia],
    ssr: true,
    transports: {
      [baseSepolia.id]: http(sepoliaRpcUrl),
    },
    appDescription:
      "PRIVACY PRESERVED, SYBIL RESISTANT POLLS NOW IN FARCASTER.",
    appUrl: "https://priv-cast.vercel.app", // your app's url
    appIcon: "https://family.co/logo.png",
  })
);
export const abi = [
  {
    inputs: [],
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
        name: "isExists",
        type: "bool",
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
        name: "_vote",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_nullifierHash",
        type: "uint256",
      },
    ],
    name: "verifyFarcasterProof",
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
];
