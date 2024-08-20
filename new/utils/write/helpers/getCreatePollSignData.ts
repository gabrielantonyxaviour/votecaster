import {
  base64_to_bytes,
  bytes,
  bytes_to_base64,
  json_to_bytes,
  sha256,
  text_to_bytes,
} from "@blake.regalia/belt";
import pinataSDK from "@pinata/sdk";
import { concat, keccak256, toBytes, toFunctionSelector } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import {
  baseSepoliaPublicClientAddress,
  gatewayPublicKey,
  routingCodeHash,
  routingContract,
} from "../../constants";
import { chacha20_poly1305_seal, ecdh } from "@solar-republic/neutrino";

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
  payloadHash: `0x${string}`;
  signData: `0x${string}`;
  userPublicKeyBytes: Uint8Array;
}> {
  try {
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

    const sharedKey = await sha256(
      ecdh(privateKeyBytes, gatewayPublicKeyBytes)
    );
    console.log("SHARED KEY");
    console.log(sharedKey);

    const callbackGasLimit = 300000;

    const pinata = new pinataSDK(
      process.env.NEXT_PUBLIC_PINATA_API_KEY,
      process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY
    );

    const body = poll;
    const options: any = {
      pinataMetadata: {
        name:
          "PRIV CAST POLL " + Math.floor(Math.random() * 10000001).toString(),
      },
      pinataOptions: {
        cidVersion: 1,
      },
    };
    const res = await pinata.pinJSONToIPFS(body, options);
    console.log("IPFS RESPONSE");
    console.log(
      "https://amethyst-impossible-ptarmigan-368.mypinata.cloud/ipfs/" +
        res.IpfsHash +
        "?pinataGatewayToken=" +
        process.env.NEXT_PUBLIC_GATEWAY_KEY
    );
    const callParams = JSON.stringify({
      poll_uri:
        "https://amethyst-impossible-ptarmigan-368.mypinata.cloud/ipfs/" +
        res.IpfsHash +
        "?pinataGatewayToken=" +
        process.env.NEXT_PUBLIC_GATEWAY_KEY,
      validity: validity,
    });

    const callbackAddress = baseSepoliaPublicClientAddress.toLowerCase();
    const callbackSelector = toFunctionSelector("upgradeHandler()");
    console.log("CALLBACK SELECTOR");
    console.log(callbackSelector);
    const payload = {
      data: callParams,
      routing_info: routingContract,
      routing_code_hash: routingCodeHash,
      user_address: callerAddress,
      user_key: bytes_to_base64(userPublicKeyBytes),
      callback_address: bytes_to_base64(toBytes(callbackAddress)),
      callback_selector: bytes_to_base64(toBytes(callbackSelector)),
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
        toBytes(ciphertextHash),
      ])
    );

    return {
      nonce,
      ciphertext,
      payloadHash,
      signData: ciphertextHash,
      userPublicKeyBytes,
    };
  } catch (e) {
    console.log("ERROR");
    console.log(e);
    return {
      nonce: new Uint8Array(),
      ciphertext: new Uint8Array(),
      payloadHash: "0x",
      signData: "0x",
      userPublicKeyBytes: new Uint8Array(),
    };
  }
}
