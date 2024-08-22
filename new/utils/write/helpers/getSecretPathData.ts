import {
  bytes,
  bytes_to_base64,
  json_to_bytes,
  text_to_bytes,
} from "@blake.regalia/belt";
import { concat, keccak256 } from "viem";
import {
  baseSepoliaPublicClientAddress,
  callbackSelector,
  publicClientAbi,
  routingCodeHash,
  routingContract,
} from "../../constants";
import { chacha20_poly1305_seal } from "@solar-republic/neutrino";
import uploadInIPFS from "@/utils/uploadInIPFS";
import generateKeys from "./generateKeys";
import { ethers } from "ethers";
import { arrayify, hexlify, recoverPublicKey } from "ethers/lib/utils";

export default async function getSecretPathData({
  callerAddress,
  functionName,
  input,
  setSignTxStatus,
}: {
  callerAddress: `0x${string}`;
  functionName: string;
  input: any;
  setSignTxStatus: (status: number) => void;
}): Promise<{
  gas: string;
  to: string;
  from: string;
  value: string;
  data: string;
}> {
  try {
    const iface = new ethers.utils.Interface(publicClientAbi);
    const routing_contract = routingContract;
    const routing_code_hash = routingCodeHash;

    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const [myAddress] = await provider.send("eth_requestAccounts", []);

    const { userPublicKeyBytes, sharedKey } = await generateKeys();

    const callbackGasLimit = 300000;
    const callbackAddress = baseSepoliaPublicClientAddress;
    // Create the data object from form state
    const data = JSON.stringify(input);

    const payload = {
      data: data,
      routing_info: routing_contract,
      routing_code_hash: routing_code_hash,
      user_address: myAddress,
      user_key: bytes_to_base64(userPublicKeyBytes),
      callback_address: bytes_to_base64(arrayify(callbackAddress)),
      callback_selector: bytes_to_base64(arrayify(callbackSelector)),
      callback_gas_limit: callbackGasLimit,
    };

    const payloadJson = JSON.stringify(payload);
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
    const msgParams = ciphertextHash;
    setSignTxStatus(2);
    const params = [myAddress, msgParams];
    const method = "personal_sign";
    const payloadSignature = await provider.send(method, params);
    const user_pubkey = recoverPublicKey(payloadHash, payloadSignature);

    const _info = {
      user_key: hexlify(userPublicKeyBytes),
      user_pubkey: user_pubkey,
      routing_code_hash: routing_code_hash,
      task_destination_network: "pulsar-3",
      handle: functionName,
      nonce: hexlify(nonce),
      payload: hexlify(ciphertext),
      payload_signature: payloadSignature,
      callback_gas_limit: callbackGasLimit,
    };

    const functionData = iface.encodeFunctionData("send", [
      payloadHash,
      myAddress,
      routing_contract,
      _info,
    ]);

    const gasFee = await provider.getGasPrice();
    let amountOfGas = gasFee.mul(callbackGasLimit).mul(3).div(2);

    return {
      gas: hexlify(150000),
      to: baseSepoliaPublicClientAddress,
      from: myAddress,
      value: hexlify(amountOfGas),
      data: functionData,
    };
  } catch (e) {
    console.log("ERROR");
    console.log(e);
    return {
      gas: "0",
      to: "0x",
      from: "0x",
      value: "0",
      data: "0x",
    };
  }
}
