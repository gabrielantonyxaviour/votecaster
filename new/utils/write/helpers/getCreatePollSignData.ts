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
      process.env.PINATA_API_KEY,
      process.env.PINATA_SECRET_API_KEY
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
        process.env.GATEWAY_KEY
    );
    const callParams = JSON.stringify({
      poll_uri:
        "https://amethyst-impossible-ptarmigan-368.mypinata.cloud/ipfs/" +
        res.IpfsHash +
        "?pinataGatewayToken=" +
        process.env.GATEWAY_KEY,
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
    console.log("PAYLOAD");
    console.log(payload);
    const plaintext = json_to_bytes(payload);
    console.log("PLAIN TEXT");
    console.log(plaintext);
    const nonce = crypto.getRandomValues(bytes(12));
    console.log("NONCE");
    console.log(nonce);

    const [ciphertextClient, tagClient] = chacha20_poly1305_seal(
      sharedKey,
      nonce,
      plaintext
    );

    console.log("CIPHERTEXT CLIENT");
    console.log(ciphertextClient);
    console.log("TAG CLIENT");
    console.log(tagClient);

    const ciphertext = concat([ciphertextClient, tagClient]);
    const ciphertextHash = keccak256(ciphertext);

    console.log("CIPHERTEXT");
    console.log(ciphertext);
    console.log("CIPHERTEXT HASH");
    console.log(ciphertextHash);

    const payloadHash = keccak256(
      concat([
        text_to_bytes("\x19Ethereum Signed Message:\n32"),
        toBytes(ciphertextHash),
      ])
    );
    console.log("PAYLOAD HASH");
    console.log(payloadHash);

    return {
      nonce,
      ciphertext,
      payloadHash,
      signData: ciphertextHash,
    };
  } catch (e) {
    console.log("ERROR");
    console.log(e);
    return {
      nonce: new Uint8Array(),
      ciphertext: new Uint8Array(),
      payloadHash: "0x",
      signData: "0x",
    };
  }
}
