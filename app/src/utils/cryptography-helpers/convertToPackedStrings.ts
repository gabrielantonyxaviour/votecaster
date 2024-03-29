export default function convertToPackedStrings(data: string[]): string[] {
  // Combine all elements into a single string
  const combinedString = data
    .map((d) => {
      return d.substring(d.length - 2);
    })
    .join("");
  // Ensure the combined string is divisible by 32 (in bytes)
  console.log(combinedString);
  console.log(combinedString.length);

  // Split the combined string into three separate chunks
  const chunkSize = 64;
  const chunks = [
    combinedString.substring(0, chunkSize),
    combinedString.substring(chunkSize, 2 * chunkSize),
    combinedString.substring(2 * chunkSize),
  ];
  console.log(chunks);
  // Convert each chunk to a 32-byte packed hex string
  const packedStrings = chunks.map((chunk) => "0x" + chunk);

  return packedStrings;
}
