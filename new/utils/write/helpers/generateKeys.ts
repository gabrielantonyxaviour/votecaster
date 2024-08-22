import { toBytes } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import {
  base64_to_bytes,
  bytes,
  bytes_to_base64,
  json_to_bytes,
  sha256,
  text_to_bytes,
} from "@blake.regalia/belt";
import { gatewayPublicKey } from "@/utils/constants";
import { chacha20_poly1305_seal, ecdh } from "@solar-republic/neutrino";

interface GenerateKeysResponse {
  userPublicKeyBytes: Uint8Array;
  sharedKey: Uint8Array;
}

export default async function generateKeys(): Promise<GenerateKeysResponse> {
  const privateKey = generatePrivateKey();
  console.log("PRIVATE KEY");
  console.log(privateKey);
  const privateKeyBytes = toBytes(privateKey);
  console.log("IN BYTES");
  console.log(privateKeyBytes);
  const userPublicKey = privateKeyToAccount(privateKey).publicKey;
  console.log("USER PUBLIC KEY");
  console.log(userPublicKey);
  const userPublicKeyBytes = toBytes(userPublicKey);
  console.log("USER PUBLIC KEY BYTES");
  console.log(userPublicKeyBytes);

  const gatewayPublicKeyBytes = base64_to_bytes(gatewayPublicKey);
  console.log("GATEWAY PUBLIC KEY BYTES");
  console.log(gatewayPublicKeyBytes);

  const sharedKey = await sha256(ecdh(privateKeyBytes, gatewayPublicKeyBytes));
  console.log("SHARED KEY");
  console.log(sharedKey);

  return {
    userPublicKeyBytes,
    sharedKey,
  };
}
