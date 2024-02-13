const { JSONRPCServer } = require("json-rpc-2.0");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const server = new JSONRPCServer();
app.post("/", (req, res) => {
  const jsonRPCRequest = req.body;
  server.receive(jsonRPCRequest).then((jsonRPCResponse) => {
    if (jsonRPCResponse) {
      res.json(jsonRPCResponse);
    } else {
      res.sendStatus(204);
    }
  });
});

server.addMethod("getSqrt", async (params) => {
  const values = params[0].Array.map(({ inner }) => {
    return { inner: `${Math.sqrt(parseInt(inner, 16))}` };
  });
  return { values: [{ Array: values }] };
});
app.listen(5555, () => {
  console.log("Server is running on port 5555");
});
