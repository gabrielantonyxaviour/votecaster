import React from "react";

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

export default function Home() {
  const [guess, setGuess] = React.useState(0);
  const [logs, setLogs] = React.useState<string[]>([]);
  const [proof, setProof] = React.useState("");

  async function guessValue() {
    try {
      setLogs((prev) => [...prev, "Guessed it right 😏"]);
    } catch (err) {
      setLogs((prev) => [...prev, "Wrong guess 💔"]);
    }
  }
  return (
    <div className="w-full flex flex-col items-center justify-center  text-center mt-10">
      <p className="font-bold text-4xl">Noir app</p>
      <div className="w-[20%] my-6 border border-[1px] border-white p-4 rounded-lg">
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
          className="bg-white px-3 py-2 rounded-lg border border-2 border-black text-black hover:border-white mt-4 hover:bg-black hover:text-white transition-all duration-300 ease-in-out"
          onClick={guessValue}
        >
          Submit
        </button>
      </div>
      <div className="w-[40%] my-6 border border-[1px] border-white p-4 rounded-lg">
        <p className="mb-2 text-xl font-semibold">Logs</p>
        {logs.map((log, index) => (
          <p
            key={index}
            className={
              log == "Guessed it right 😏" ? "text-[#00ff00]" : "text-[#ff0000]"
            }
          >
            {log}
          </p>
        ))}
      </div>
      <div className="w-[60%] my-6 border border-[1px] border-white p-4 rounded-lg">
        <p className="mb-2 text-xl font-semibold">Proof</p>
      </div>
    </div>
  );
}
