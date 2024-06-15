import { error } from "console";

const pinataSDK = require("@pinata/sdk");
const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT_KEY });
type State = {
  question: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  optionsCreated: number;
  theme: number;
  validity: number;
};

export default async function uploadJSONtoIPFS({ input }: { input: State }) {
  try {
    const options = {
      pinataMetadata: {
        name: "Priv Cast",
      },
      pinataOptions: {
        cidVersion: 0,
      },
    };
    const res = await pinata.pinJSONToIPFS(input, options);
    console.log(res);

    return {
      success: true,
      hash: res.data.IpfsHash,
      error: "",
    };
  } catch (e) {
    return {
      sucess: false,
      hash: "",
      error: e,
    };
  }
}
