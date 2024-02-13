import {
  createPublicClient,
  createWalletClient,
  custom,
  decodeEventLog,
  http,
} from "viem";
import { CHAIN, PRIVATE_KEY, IdContract, IdGateway } from "./constants";
import { privateKeyToAccount } from "viem/accounts";
import { idRegistryABI } from "@farcaster/hub-web";

const publicClient = createPublicClient({
  chain: CHAIN,
  transport: http(),
});
const account = privateKeyToAccount(PRIVATE_KEY);
const walletClient = createWalletClient({
  account,
  chain: CHAIN,
  transport: http(),
});
const getOrRegisterFid = async (): Promise<number> => {
  const balance = await publicClient.getBalance({ address: account.address });
  // Check if we already have an fid
  const existingFid = (await publicClient.readContract({
    ...IdContract,
    functionName: "idOf",
    args: [account.address],
  })) as bigint;

  if (existingFid > BigInt(0)) {
    return parseInt(existingFid.toString());
  }

  const price = await publicClient.readContract({
    ...IdGateway,
    functionName: "price",
  });
  if (balance < price) {
    throw new Error(
      `Insufficient balance to rent storage, required: ${price}, balance: ${balance}`
    );
  }
  const { request: registerRequest } = await publicClient.simulateContract({
    ...IdGateway,
    functionName: "register",
    args: [account.address],
    value: price,
  });

  const registerTxHash = await walletClient.writeContract(registerRequest);
  const registerTxReceipt = await publicClient.waitForTransactionReceipt({
    hash: registerTxHash,
  });
  // Now extract the FID from the logs
  const registerLog = decodeEventLog({
    abi: idRegistryABI,
    data: registerTxReceipt.logs[0].data,
    topics: registerTxReceipt.logs[0].topics,
  });
  const fid = parseInt((registerLog as any).args["id"]);
  return fid;
};

export default getOrRegisterFid;
