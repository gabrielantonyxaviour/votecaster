import {
  base64_to_bytes,
  bytes_to_base64,
  json_to_bytes,
  sha256,
  text_to_bytes,
} from "@blake.regalia/belt";
import { concat, keccak256, toBytes, toFunctionSelector } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import {
  baseSepoliaPublicClientAddress,
  gatewayPublicKey,
  routingCodeHash,
  routingContract,
} from "../../constants";
import { chacha20_poly1305_seal, ecdh } from "@solar-republic/neutrino";

export default async function getCastVoteSignData({
  callerAddress,
  pollId,
  farcasterId,
  vote,
}: {
  callerAddress: `0x${string}`;
  pollId: number;
  farcasterId: number;
  vote: number;
}): Promise<{
  ciphertext: Uint8Array;
  payloadHash: `0x${string}`;
  signData: `0x${string}`;
}> {
  const privateKey = generatePrivateKey();
  console.log("PRIVATE KEY");
  console.log(privateKey);
  const privateKeyBytes = toBytes(privateKey);
  console.log("IN BYTES");
  console.log(privateKeyBytes);
  const userPublicKey = privateKeyToAccount(privateKey).publicKey;
  const userPublicKeyBytes = toBytes(userPublicKey);

  const gatewayPublicKeyBytes = base64_to_bytes(gatewayPublicKey);

  const sharedKey = await sha256(ecdh(privateKeyBytes, gatewayPublicKeyBytes));
  const callbackGasLimit = 300000;
  const callParams = JSON.stringify({
    poll_id: pollId,
    farcaster_id: farcasterId,
    vote,
  });

  const callbackAddress = baseSepoliaPublicClientAddress.toLowerCase();
  const callbackSelector = toFunctionSelector("upgradeHandler()");
  const payload = {
    data: callParams,
    routing_info: routingContract,
    routing_code_hash: routingCodeHash,
    user_address: callerAddress,
    user_key: bytes_to_base64(userPublicKeyBytes),
    callback_address: bytes_to_base64(toBytes(callbackAddress)),
    callback_selector: bytes_to_base64(toBytes(callbackSelector)),
    callback_gas_limit: callbackGasLimit,
  };

  const plaintext = json_to_bytes(payload);
  const nonce = crypto.getRandomValues(toBytes(12));

  const [ciphertextClient, tagClient] = chacha20_poly1305_seal(
    sharedKey,
    nonce,
    plaintext
  );
  const ciphertext = concat([ciphertextClient, tagClient]);
  const ciphertextHash = keccak256(ciphertext);
  const payloadHash = keccak256(
    concat([
      text_to_bytes("\x19Ethereum Signed Message:\n32"),
      toBytes(ciphertextHash),
    ])
  );

  return {
    ciphertext,
    payloadHash,
    signData: concat([callerAddress, ciphertextHash]),
  };
}
