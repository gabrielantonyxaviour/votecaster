"use client";
import React from "react";
import circuit from "@/utils/circuit.json";
import {
  BarretenbergBackend,
  CompiledCircuit,
} from "@noir-lang/backend_barretenberg";
import {
  ForeignCallHandler,
  ForeignCallInput,
  ForeignCallOutput,
  InputMap,
  Noir,
} from "@noir-lang/noir_js";

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
  const [guess, setGuess] = React.useState(0);
  const [logs, setLogs] = React.useState<string[]>([]);
  const [proof, setProof] = React.useState<Uint8Array>();
  const foreignCallHandler: ForeignCallHandler = async (
    name: string,
    inputs: ForeignCallInput[]
  ): Promise<ForeignCallOutput[]> => {
    return [""];
  };
  async function guessValue() {
    try {
      const backend = new BarretenbergBackend(circuit as CompiledCircuit);
      const noir = new Noir(circuit as CompiledCircuit, backend);
      setLogs((prev) => [...prev, "Generating proof... ⏳"]);
      const proof = await noir.generateFinalProof(
        { x: guess, y: 5 },
        foreignCallHandler
      );
      console.log(proof);
      setProof(proof.proof);
      setLogs((prev) => [...prev, "Guessed it right 😏"]);
      setLogs((prev) => [...prev, "Verifying proof... ⏳"]);
      const isValid = await noir.verifyFinalProof(proof);
      if (isValid) {
        setLogs((prev) => [...prev, "Proof verified ✅"]);
      } else {
        setLogs((prev) => [...prev, "Proof verification failed ❌"]);
      }
    } catch (err) {
      setLogs((prev) => [...prev, "Wrong guess 💔"]);
    }
  }
  return (
    <div className="w-full flex flex-col items-center justify-center  text-center mt-10">
      <p className="font-bold text-4xl">Noir app</p>
      <div className="w-[20%] my-6  border-[1px] border-white p-4 rounded-lg">
        <p className="mb-2 text-xl font-semibold">Your Guess</p>
        <input
          type="number"
          className="text-black"
          value={guess}
          onChange={(e) => {
            if (!(parseInt(e.target.value) < 0)) {
              setGuess(parseInt(e.target.value));
            }
          }}
        ></input>
        <button
          className="bg-white px-3 py-2 rounded-lg  border-2 border-black text-black hover:border-white mt-4 hover:bg-black hover:text-white transition-all duration-300 ease-in-out"
          onClick={guessValue}
        >
          Submit
        </button>
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
