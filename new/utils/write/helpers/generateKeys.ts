import { base64_to_bytes, sha256 } from "@blake.regalia/belt";
import { gatewayPublicKey } from "@/utils/constants";
import { ecdh } from "@solar-republic/neutrino";
import { ethers } from "ethers";
import { arrayify, SigningKey } from "ethers/lib/utils";
interface GenerateKeysResponse {
  userPublicKeyBytes: Uint8Array;
  sharedKey: Uint8Array;
}

export default async function generateKeys(): Promise<GenerateKeysResponse> {
  const wallet = ethers.Wallet.createRandom();
  const userPrivateKeyBytes = arrayify(wallet.privateKey);
  const userPublicKey = new SigningKey(wallet.privateKey).compressedPublicKey;
  const userPublicKeyBytes = arrayify(userPublicKey);
  const gatewayPublicKeyBytes = base64_to_bytes(gatewayPublicKey);

  const sharedKey = await sha256(
    ecdh(userPrivateKeyBytes, gatewayPublicKeyBytes)
  );

  return {
    userPublicKeyBytes,
    sharedKey,
  };
}
