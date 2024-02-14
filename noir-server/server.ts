const { JSONRPCServer } = require("json-rpc-2.0");
const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const { init, fetchQuery } = require("@airstack/node");

interface QueryResponse {
  data: Data;
  error: Error;
}

interface Data {
  Wallet: Wallet;
}

interface Error {
  message: string;
}

interface Wallet {
  socials: Social[];
  addresses: string[];
}

interface Social {
  dappName: "lens" | "farcaster";
  profileName: string;
}

init(process.env.AIRSTACK_API_KEY);

const app = express();
app.use(bodyParser.json());

const server = new JSONRPCServer();
app.post("/", (req: any, res: any) => {
  const jsonRPCRequest = req.body;
  server.receive(jsonRPCRequest).then((jsonRPCResponse: any) => {
    if (jsonRPCResponse) {
      res.json(jsonRPCResponse);
    } else {
      res.sendStatus(204);
    }
  });
});

server.addMethod("getSqrt", async (params: any) => {
  const values = params[0].Array.map(({ inner }: any) => {
    return { inner: `${Math.sqrt(parseInt(inner, 16))}` };
  });
  return { values: [{ Array: values }] };
});

server.addMethod("getFid", async (params: any) => {
  console.log(params);
  const address = params[0];
  const query = `
  query MyQuery {
    Socials(
      input: {blockchain: ethereum, filter: {dappName: {_eq: farcaster}, identity: {_eq: "${address}"}}}
    ) {
      Social {
        userId
      }
    }
  }
  `;
  const { data, error }: QueryResponse = await fetchQuery(query);

  if (error) {
    throw new Error(error.message);
  }
  const fid = (data as any).Socials.Social[0].userId;
  return { fid };
});

server.addMethod("validateMessage", async (params: any) => {});

app.listen(5555, () => {
  console.log("Server is running on port 5555");
});
