import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";

export default async function getGasPrice() {
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });
  const gasPrice = await publicClient.getGasPrice();
  console.log("GAS PRICE");
  console.log(gasPrice);
  return gasPrice;
}
