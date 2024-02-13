// import {
//   createWalletClient,
//   decodeEventLog,
//   fromHex,
//   http,
//   publicActions,
//   zeroAddress,
// } from "viem";
// import {
//   CHAIN,
//   PRIVATE_KEY,
//   IdContract,
//   IdGateway,
//   KeyContract,
//   USE_SSL,
//   HUB_URL,
//   HUB_USERNAME,
//   HUB_PASS,
//   RECOVERY_ADDRESS,
// } from "./constants";
// import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
// import {
//   ViemLocalEip712Signer,
//   ed25519,
//   getAuthMetadata,
//   idRegistryABI,
// } from "@farcaster/hub-web";
// import { createPrivateKey } from "crypto";
// import {
//   Metadata,
//   getInsecureHubRpcClient,
//   getSSLHubRpcClient,
// } from "@farcaster/hub-nodejs";

// const account = privateKeyToAccount(PRIVATE_KEY);
// const walletClient = createWalletClient({
//   account,
//   chain: CHAIN,
//   transport: http(),
// }).extend(publicActions);

// const hubClient = USE_SSL
//   ? getSSLHubRpcClient(HUB_URL)
//   : getInsecureHubRpcClient(HUB_URL);
// const metadata =
//   HUB_USERNAME !== "" && HUB_PASS !== ""
//     ? getAuthMetadata(HUB_USERNAME, HUB_PASS)
//     : new Metadata();

// const getOrRegisterFid = async (): Promise<number> => {
//   const balance = await walletClient.getBalance({ address: account.address });
//   const existingFid = (await walletClient.readContract({
//     ...IdContract,
//     functionName: "idOf",
//     args: [account.address],
//   })) as bigint;

//   console.log(`Using address: ${account.address} with balance: ${balance}`);

//   if (balance === BigInt(0) && existingFid === BigInt(0)) {
//     throw new Error("No existing Fid and no funds to register an fid");
//   }

//   if (existingFid > BigInt(0)) {
//     console.log(`Using existing fid: ${existingFid}`);
//     return parseInt(existingFid.toString());
//   }

//   const price = await walletClient.readContract({
//     ...IdGateway,
//     functionName: "price",
//   });

//   console.log(`Cost to rent storage: ${price}`);

//   if (balance < price) {
//     throw new Error(
//       `Insufficient balance to rent storage, required: ${price}, balance: ${balance}`
//     );
//   }

//   const { request: registerRequest } = await walletClient.simulateContract({
//     ...IdGateway,
//     functionName: "register",
//     args: [RECOVERY_ADDRESS],
//     value: price,
//   });
//   const registerTxHash = await walletClient.writeContract(registerRequest);
//   console.log(`Waiting for register tx to confirm: ${registerTxHash}`);
//   const registerTxReceipt = await walletClient.waitForTransactionReceipt({
//     hash: registerTxHash,
//   });
//   // Now extract the FID from the logs
//   const registerLog = decodeEventLog({
//     abi: idRegistryABI,
//     data: registerTxReceipt.logs[0].data,
//     topics: registerTxReceipt.logs[0].topics,
//   });
//   // @ts-ignore
//   const fid = parseInt(registerLog.args["id"]);
//   console.log(`Registered fid: ${fid} to ${account.address}`);

//   return fid;
// };

// const getOrRegisterAccountKey = async (fid: number) => {
//   if (PRIVATE_KEY !== zeroAddress) {
//     // If a private key is provided, we assume the account key is already in the key registry
//     const privateKeyBytes = fromHex(PRIVATE_KEY, "bytes");
//     const publicKeyBytes = ed25519.getPublicKey(privateKeyBytes);
//     return publicKeyBytes;
//   }

//   const privateKey = generatePrivateKey();
//   const signer = privateKeyToAccount(privateKey);

//   // const eip712signer = new ViemLocalEip712Signer({
//   //   publicKey: publicKey.publicKey,
//   //   address: publicKey.address,
//   //   source: "custom",
//   //   type: "local",
//   // });
//   // To add a key, we need to sign the metadata with the fid of the app we're adding the key on behalf of
//   // Use your personal fid, or register a separate fid for the app
//   const metadata = await eip712signer.getSignedKeyRequestMetadata({
//     requestFid: BigInt(fid),
//     key: APP_PRIVATE_KEY,
//     deadline: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour from now
//   });

//   const { request: signerAddRequest } = await walletClient.simulateContract({
//     ...KeyContract,
//     functionName: "add",
//     args: [1, publicKey, 1, metadata], // keyType, publicKey, metadataType, metadata
//   });

//   const accountKeyAddTxHash = await walletClient.writeContract(
//     signerAddRequest
//   );
//   await walletClient.waitForTransactionReceipt({ hash: accountKeyAddTxHash });
//   // Sleeping 30 seconds to allow hubs to pick up the accountKey tx
//   await new Promise((resolve) => setTimeout(resolve, 30000));
//   return privateKey;
// };

// export { getOrRegisterFid, getOrRegisterAccountKey };
