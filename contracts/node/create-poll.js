import { SecretNetworkClient, Wallet, coinsFromString } from "secretjs";
import dotenv from "dotenv";
dotenv.config();

const wallet = new Wallet(process.env.MNEMONIC);

const secretjs = new SecretNetworkClient({
  chainId: "pulsar-3",
  url: "https://api.pulsar3.scrttestnet.com",
  wallet: wallet,
  walletAddress: wallet.address,
});

let codeHash =
  "efeec5a5b46f9ba5895bdf29ecf08cf188738e03574ebc3aa206ac6586d3057b";
let contractAddress = "secret1u8z5wtfz2ddrs8lvuuxevdlthjjlf8a7tprxen";

let try_execute = async () => {
  const tx = await secretjs.tx.compute.executeContract(
    {
      sender: wallet.address,
      contract_address: contractAddress,
      msg: {
        create_poll: {
          poll_uri: "Hello",
          validity: 1000000000,
        },
      },
      code_hash: codeHash,
    },
    { gasLimit: 100_000 }
  );

  console.log(tx);
};
try_execute();
