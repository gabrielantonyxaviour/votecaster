import { encodeFunctionData, toBytes, toHex } from "viem";
import {
  baseSepoliaPublicClientAddress,
  publicClientAbi,
  routingCodeHash,
  routingContract,
} from "../constants";
import getGasPrice from "../getGasPrice";

export default async function castVote({
  nonce,
  userAddress,
  userPublicKey,
  userPublicKeyBytes,
  signature,
  ciphertext,
  payloadHash,
}: {
  nonce: Uint8Array;
  userAddress: string;
  userPublicKey: string;
  userPublicKeyBytes: Uint8Array;
  ciphertext: Uint8Array;
  payloadHash: `0x${string}`;
  signature: `0x${string}`;
}): Promise<{
  gas: `0x${string}`;
  to: `0x${string}`;
  from: `0x${string}`;
  value: `0x${string}`;
  data: `0x${string}`;
}> {
  const callbackGasLimit = 300000;

  try {
    const _info = {
      user_key: toHex(userPublicKeyBytes),
      user_pubkey: userPublicKey,
      routing_code_hash: routingCodeHash,
      task_destination_network: "pulsar-3",
      handle: "create_proposal",
      nonce: toHex(nonce),
      payload: toHex(ciphertext),
      payload_signature: signature,
      callback_gas_limit: callbackGasLimit,
    };

    const functionData = encodeFunctionData({
      abi: publicClientAbi,
      functionName: "send",
      args: [payloadHash, userAddress, routingContract, _info],
    });

    const gasPrice = await getGasPrice();

    const tx_params = {
      gas: toHex(150000),
      to: baseSepoliaPublicClientAddress as `0x${string}`,
      from: userAddress as `0x${string}`,
      value: toHex(gasPrice),
      data: functionData,
    };
    console.log("TX PARAMS");
    console.log(tx_params);
    return tx_params;
  } catch (e) {
    console.log(e);
    return {
      gas: "0x0",
      to: "0x0",
      from: "0x0",
      value: "0x0",
      data: "0x0",
    };
  }
}
