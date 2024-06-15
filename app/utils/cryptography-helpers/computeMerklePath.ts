import { encodePacked, keccak256 } from "viem";

export default function computeMerklePath(
  leafIndex: number,
  leaves: number[]
): `0x${string}`[] {
  if (leafIndex < 0 || leafIndex >= leaves.length) {
    throw new Error("Leaf index out of range");
  }

  const merklePath: `0x${string}`[] = [];
  let currentIndex = leafIndex;
  let currentLayer: `0x${string}`[] = leaves.map((leaf) =>
    keccak256(`0x${leaf.toString(16)}`)
  );

  while (currentLayer.length > 1) {
    const siblingIndex =
      currentIndex % 2 === 0 ? currentIndex + 1 : currentIndex - 1;
    const siblingHash = currentLayer[siblingIndex];
    merklePath.push(siblingHash);

    currentIndex = Math.floor(currentIndex / 2);
    const nextLayer: `0x${string}`[] = [];

    for (let i = 0; i < currentLayer.length; i += 2) {
      nextLayer.push(
        keccak256(
          encodePacked(
            ["bytes32", "bytes32"],
            [currentLayer[i], currentLayer[i + 1]]
          )
        )
      );
    }

    currentLayer = nextLayer;
  }

  return merklePath;
}
