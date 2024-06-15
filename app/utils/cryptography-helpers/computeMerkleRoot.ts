import { encodePacked, keccak256 } from "viem";

export default function computeMerkleRoot(points: number[]): `0x${string}` {
  const hashedValues: `0x${string}`[] = points.map((point: number) =>
    keccak256(`0x${point.toString(16)}`)
  );

  function recursiveMerkleRoot(hashes: `0x${string}`[]): `0x${string}` {
    if (hashes.length === 1) {
      return hashes[0];
    }

    const nextLevelHashes: `0x${string}`[] = [];

    // Combine adjacent hashes and hash them together
    for (let i = 0; i < hashes.length; i += 2) {
      const left = hashes[i];
      const right = i + 1 < hashes.length ? hashes[i + 1] : "0x";
      const combinedHash = keccak256(
        encodePacked(["bytes32", "bytes32"], [left, right])
      );
      nextLevelHashes.push(combinedHash);
    }

    // Recur for the next level
    return recursiveMerkleRoot(nextLevelHashes);
  }

  // Start the recursive computation
  return recursiveMerkleRoot(hashedValues);
}
