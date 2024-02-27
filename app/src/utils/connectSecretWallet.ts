import { MetaMaskWallet, SecretNetworkClient } from "secretjs";

interface ConnectionResult {
  wallet: MetaMaskWallet; // Replace with the actual type for MetaMaskWallet
  secretjs: SecretNetworkClient; // Replace with the actual type for SecretNetworkClient
}
const connectSecretWallet = async (
  address: string
): Promise<ConnectionResult | undefined> => {
  try {
    const wallet = await MetaMaskWallet.create(
      (window as any).ethereum,
      address
    );
    const secretjs = new SecretNetworkClient({
      url: "https://api.pulsar3.scrttestnet.com",
      chainId: "pulsar-3",
      wallet: wallet,
      walletAddress: wallet.address,
    });
    console.log("Connected to Secret Network", secretjs);
    return { wallet, secretjs };
  } catch (error) {
    console.error("Error connecting to MetaMask", error);
  }
};
export default connectSecretWallet;
