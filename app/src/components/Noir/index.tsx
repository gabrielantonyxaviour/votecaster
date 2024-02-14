"use client";
import React, { useEffect } from "react";
import circuit from "@/utils/circuit.json";
import signCircuit from "@/utils/cryptosign.json";
import {
  BarretenbergBackend,
  CompiledCircuit,
} from "@noir-lang/backend_barretenberg";
import {
  ForeignCallHandler,
  ForeignCallInput,
  ForeignCallOutput,
  Noir,
} from "@noir-lang/noir_js";
import {
  createWalletClient,
  custom,
  hashMessage,
  keccak256,
  recoverPublicKey,
  toHex,
} from "viem";
import { scrollSepolia } from "viem/chains";
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";

const setup = async () => {
  await Promise.all([
    import("@noir-lang/noirc_abi").then((module) =>
      module.default(
        new URL(
          "@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm",
          import.meta.url
        ).toString()
      )
    ),
    import("@noir-lang/acvm_js").then((module) =>
      module.default(
        new URL(
          "@noir-lang/acvm_js/web/acvm_js_bg.wasm",
          import.meta.url
        ).toString()
      )
    ),
  ]);
};

export default function NoirComponent() {
  const [testData, setTestData] = React.useState<string>("");
  const [logs, setLogs] = React.useState<string[]>([]);
  const [proof, setProof] = React.useState<Uint8Array>();
  const [walletClient, setWalletClient] = React.useState<any>();
  const { address } = useAccount();

  useEffect(() => {
    if ((window as any).ethereum != undefined) {
      setWalletClient(
        createWalletClient({
          chain: scrollSepolia,
          transport: custom((window as any).ethereum),
        })
      );
    }
  }, []);

  const foreignCallHandler: ForeignCallHandler = async (
    name: string,
    inputs: ForeignCallInput[]
  ): Promise<ForeignCallOutput[]> => {
    return [
      [
        "0x" +
          Math.sqrt(parseInt(inputs[0][0], 16)).toString(16).padStart(64, "0"),
        "0x" +
          Math.sqrt(parseInt(inputs[0][1], 16)).toString(16).padStart(64, "0"),
      ],
    ];
  };

  async function testOracle() {
    try {
      const backend = new BarretenbergBackend(circuit as CompiledCircuit);
      const noir = new Noir(circuit as CompiledCircuit, backend);
      setLogs((prev) => [...prev, "Generating proof... ⏳"]);
      const proof = await noir.generateFinalProof(
        { input: [4, 36] },
        foreignCallHandler
      );
      console.log(proof);
      setProof(proof.proof);
      setLogs((prev) => [...prev, "Proof Generation Success 😏"]);
      setLogs((prev) => [...prev, "Verifying proof... ⏳"]);
      const isValid = await noir.verifyFinalProof(proof);

      if (isValid) {
        setLogs((prev) => [...prev, "Proof verified ✅"]);
      } else {
        setLogs((prev) => [...prev, "Proof verification failed ❌"]);
      }
    } catch (err) {
      setLogs((prev) => [...prev, "Wrong inputs 💔"]);
    }
  }

  async function testSignature() {
    try {
      const backend = new BarretenbergBackend(signCircuit as CompiledCircuit);
      const noir = new Noir(signCircuit as CompiledCircuit, backend);
      const hdata = Buffer.from(hashMessage(testData).slice(2), "hex");
      const sig = Buffer.from(
        (
          await walletClient.signMessage({
            account: address,
            message: testData,
          })
        ).slice(2),
        "hex"
      );
      const trimmedSig = new Uint8Array(sig.subarray(0, sig.length - 1));
      const publicKey = await recoverPublicKey({
        hash: hdata,
        signature: sig,
      });
      const publicKeyBuffer = Buffer.from(publicKey.slice(2), "hex");

      // Extract x and y coordinates
      const xCoordHex = publicKeyBuffer.subarray(1, 33);
      const yCoordHex = publicKeyBuffer.subarray(33);
      console.log(Array.from(xCoordHex).map((byte) => `${byte}`));
      setLogs((prev) => [...prev, "Generating proof... ⏳"]);
      console.log({
        pub_key_x: Array.from(xCoordHex).map((byte) => `${byte}`),
        pub_key_y: Array.from(yCoordHex).map((byte) => `${byte}`),
        signature: Array.from(trimmedSig).map((byte) => `${byte}`),
        hashed_message: Array.from(hdata).map((byte) => `${byte}`),
      });
      const proof = await noir.generateFinalProof({
        pub_key_x: Array.from(xCoordHex).map((byte) => `${byte}`),
        pub_key_y: Array.from(yCoordHex).map((byte) => `${byte}`),
        signature: Array.from(trimmedSig).map((byte) => `${byte}`),
        hashed_message: Array.from(hdata).map((byte) => `${byte}`),
      });
      console.log(proof);
      setProof(proof.proof);
      setLogs((prev) => [...prev, "Proof Generation Success 😏"]);
      setLogs((prev) => [...prev, "Verifying proof... ⏳"]);
      const isValid = await noir.verifyFinalProof(proof);

      if (isValid) {
        setLogs((prev) => [...prev, "Proof verified ✅"]);
      } else {
        setLogs((prev) => [...prev, "Proof verification failed ❌"]);
      }
    } catch (err) {
      console.log(err);
      setLogs((prev) => [...prev, "Wrong inputs 💔"]);
    }
  }

  async function testFid() {}
  return (
    <div className="w-full flex flex-col items-center justify-center  text-center mt-10">
      <p className="font-bold text-4xl mb-2">Noir app</p>
      <ConnectKitButton />
      <div className="w-full flex justify-center space-x-4">
        <div className="w-[20%] my-6  border-[1px] border-white p-4 rounded-lg">
          <p className="mb-2 text-xl font-semibold">Test Oracle</p>

          <button
            className="bg-white px-3 py-2 rounded-lg  border-2 border-black text-black hover:border-white mt-4 hover:bg-black hover:text-white transition-all duration-300 ease-in-out"
            onClick={testOracle}
          >
            Go
          </button>
        </div>
        <div className="w-[20%] my-6  border-[1px] border-white p-4 rounded-lg">
          <p className="mb-2 text-xl font-semibold">Test Signature</p>
          <input
            type="text"
            className="text-black w-full"
            value={testData}
            onChange={(e) => {
              setTestData(e.target.value);
            }}
          ></input>

          <button
            className="bg-white px-3 py-2 rounded-lg  border-2 border-black text-black hover:border-white mt-4 hover:bg-black hover:text-white transition-all duration-300 ease-in-out"
            onClick={testSignature}
          >
            Go
          </button>
        </div>
        <div className="w-[20%] my-6  border-[1px] border-white p-4 rounded-lg">
          <p className="mb-2 text-xl font-semibold">Test Farcaster id</p>

          <button
            className="bg-white px-3 py-2 rounded-lg  border-2 border-black text-black hover:border-white mt-4 hover:bg-black hover:text-white transition-all duration-300 ease-in-out"
            onClick={testFid}
          >
            Go
          </button>
        </div>
      </div>
      <div className="w-[40%] my-6  border-[1px] border-white p-4 rounded-lg">
        <p className="mb-2 text-xl font-semibold">Logs</p>
        {logs.map((log, index) => (
          <p
            key={index}
            className={
              log == "Guessed it right 😏" || log == "Proof verified ✅"
                ? "text-[#00ff00]"
                : log == "Wrong guess 💔" ||
                  log == "Proof verification failed ❌"
                ? "text-[#ff0000]"
                : "text-[#0000ff]"
            }
          >
            {log}
          </p>
        ))}
      </div>
      <div className="w-[60%] my-6  border-[1px] border-white p-4 rounded-lg  ">
        <p className="mb-2 text-xl font-semibold whitespace-wrap">Proof</p>
        <p className="whitespace-normal overflow-x-auto">{proof?.toString()}</p>
      </div>
    </div>
  );
}
