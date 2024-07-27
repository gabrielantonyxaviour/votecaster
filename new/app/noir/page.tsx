import NoirComponent from "@/components/Noir";
import React, { useEffect } from "react";
import initNoirWasm from "@noir-lang/noir_wasm";
import initNoirC from "@noir-lang/noirc_abi";
import initACVM from "@noir-lang/acvm_js";

export let metadata = {
  title: "Priv Cast",
  description:
    "Sybil Resistant and Private Voting Application built on Farcaster with Aztec/Noir.",
};
const InitWasm = ({ children }: any) => {
  const [init, setInit] = React.useState(false);
  useEffect(() => {
    (async () => {
      await Promise.all([
        // initNoirWasm(
        //   new URL(
        //     "@noir-lang/noir_wasm/web/noir_wasm_bg.wasm",
        //     import.meta.url
        //   ).toString()
        // ),
        initACVM(
          new URL(
            "@noir-lang/acvm_js/web/acvm_js_bg.wasm",
            import.meta.url
          ).toString()
        ),
        initNoirC(
          new URL(
            "@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm",
            import.meta.url
          ).toString()
        ),
      ]);
      setInit(true);
    })();
  });

  return <div>{init && children}</div>;
};

export default function HomePage() {
  return (
    <InitWasm>
      <NoirComponent />
    </InitWasm>
  );
}
