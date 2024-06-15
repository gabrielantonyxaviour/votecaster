export default function bytes32ToUint8Array(bytes32: `0x${string}`): number[] {
  if (!bytes32.startsWith("0x") || bytes32.length !== 66) {
    throw new Error("Invalid bytes32 format");
  }

  const hexString = bytes32.slice(2);
  const byteArray = [];

  for (let i = 0; i < hexString.length; i += 2) {
    byteArray.push(parseInt(hexString.slice(i, i + 2), 16));
  }

  return byteArray;
}
