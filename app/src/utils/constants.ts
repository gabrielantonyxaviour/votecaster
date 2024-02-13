import {
  ID_GATEWAY_ADDRESS,
  idGatewayABI,
  KEY_GATEWAY_ADDRESS,
  keyGatewayABI,
  ID_REGISTRY_ADDRESS,
  idRegistryABI,
  FarcasterNetwork,
} from "@farcaster/hub-web";
import { optimism } from "viem/chains";
import { Hex, zeroAddress } from "viem";

export const PRIVATE_KEY: `0x${string}` = (process.env.PRIVATE_KEY ||
  "0x") as `0x${string}`;
export const OP_PROVIDER_URL = "<REQUIRED>"; // Alchemy or Infura url
export const RECOVERY_ADDRESS = zeroAddress; // Optional, using the default value means the account will not be recoverable later if the mnemonic is lost
export const ACCOUNT_KEY_PRIVATE_KEY: Hex = zeroAddress; // Optional, using the default means a new account key will be created each time

// Note: nemes is the Farcaster team's mainnet hub, which is password protected to prevent abuse. Use a 3rd party hub
// provider like https://neynar.com/ Or, run your own mainnet hub and broadcast to it permissionlessly.
export const HUB_URL = "nemes.farcaster.xyz:2283"; // URL + Port of the Hub
export const HUB_USERNAME = ""; // Username for auth, leave blank if not using TLS
export const HUB_PASS = ""; // Password for auth, leave blank if not using TLS
export const USE_SSL = false; // set to true if talking to a hub that uses SSL (3rd party hosted hubs or hubs that require auth)
export const FC_NETWORK = FarcasterNetwork.MAINNET; // Network of the Hub

export const CHAIN = optimism;

export const IdGateway = {
  abi: idGatewayABI,
  address: ID_GATEWAY_ADDRESS,
  chain: CHAIN,
};
export const IdContract = {
  abi: idRegistryABI,
  address: ID_REGISTRY_ADDRESS,
  chain: CHAIN,
};
export const KeyContract = {
  abi: keyGatewayABI,
  address: KEY_GATEWAY_ADDRESS,
  chain: CHAIN,
};
