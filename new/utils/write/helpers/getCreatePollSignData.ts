import {
  bytes,
  bytes_to_base64,
  json_to_bytes,
  text_to_bytes,
  concat,
} from "@blake.regalia/belt";
import {
  baseSepoliaPublicClientAddress,
  callbackSelector,
  routingCodeHash,
  routingContract,
} from "../../constants";
import { chacha20_poly1305_seal } from "@solar-republic/neutrino";
import uploadInIPFS from "@/utils/uploadInIPFS";
import generateKeys from "./generateKeys";
import { arrayify, keccak256 } from "ethers/lib/utils";

export default async function getCreatePollSignData({
  callerAddress,
  poll,
  validity,
}: {
  callerAddress: `0x${string}`;
  poll: any;
  validity: number;
}): Promise<{
  nonce: Uint8Array;
  ciphertext: Uint8Array;
  payloadHash: string;
  userPublicKeyBytes: Uint8Array;
  ciphertextHash: string;
}> {
  try {
    const { userPublicKeyBytes, sharedKey } = await generateKeys();
    const callbackGasLimit = 300000;

    const url = uploadInIPFS({ poll });

    const callParams = JSON.stringify({
      poll_uri: url,
      validity: validity,
    });

    const payload = {
      data: callParams,
      routing_info: routingContract,
      routing_code_hash: routingCodeHash,
      user_address: callerAddress,
      user_key: bytes_to_base64(userPublicKeyBytes),
      callback_address: bytes_to_base64(
        arrayify(baseSepoliaPublicClientAddress)
      ),
      callback_selector: bytes_to_base64(arrayify(callbackSelector)),
      callback_gas_limit: callbackGasLimit.toString(),
    };

    const plaintext = json_to_bytes(payload);
    const nonce = crypto.getRandomValues(bytes(12));

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
        arrayify(ciphertextHash),
      ])
    );

    return {
      nonce,
      ciphertext,
      payloadHash,
      userPublicKeyBytes,
      ciphertextHash,
    };
  } catch (e) {
    console.log("ERROR");
    console.log(e);
    return {
      nonce: new Uint8Array(),
      ciphertext: new Uint8Array(),
      payloadHash: "0x",
      ciphertextHash: "0x",
      userPublicKeyBytes: new Uint8Array(),
    };
  }
}
