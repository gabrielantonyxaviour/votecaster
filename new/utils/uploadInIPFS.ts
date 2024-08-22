import pinataSDK from "@pinata/sdk";

export default async function uploadInIPFS({
  poll,
}: {
  poll: any;
}): Promise<string> {
  const pinata = new pinataSDK(
    process.env.NEXT_PUBLIC_PINATA_API_KEY,
    process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY
  );

  const body = poll;
  const options: any = {
    pinataMetadata: {
      name: "PRIV CAST POLL " + Math.floor(Math.random() * 10000001).toString(),
    },
    pinataOptions: {
      cidVersion: 1,
    },
  };
  const res = await pinata.pinJSONToIPFS(body, options);

  return (
    "https://amethyst-impossible-ptarmigan-368.mypinata.cloud/ipfs/" +
    res.IpfsHash +
    "?pinataGatewayToken=" +
    process.env.NEXT_PUBLIC_GATEWAY_KEY
  );
}
