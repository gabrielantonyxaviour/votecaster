import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const requestData = req.body;
      const result = await handleJsonRpcRequest(requestData);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error processing JSON-RPC request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}

async function handleJsonRpcRequest(requestData: any) {
  if (requestData.method === "getSqrt") {
    return await exampleMethod(requestData.params);
  }

  throw new Error("Method not found");
}

async function exampleMethod(params: any) {
  const values = params[0].Array.map(({ inner }: { inner: string }) => {
    return { inner: `${Math.sqrt(parseInt(inner, 16))}` };
  });
  console.log({ values: [{ Array: values }] });
  console.log(values);
  return { values: [{ Array: values }] };
}
