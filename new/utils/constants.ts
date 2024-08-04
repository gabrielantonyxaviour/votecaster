const baseSepoliaPublicClientAddress =
  "0xfaFCfceC4e29e9b4ECc8C0a3f7df1011580EEEf2";

const routingContract = "secret17y4avu53kyujrcyd3zyx3t3g3cph5ama24287j";
const routingCodeHash =
  "0x883b58fa897b8ce680f8a78deab5eab934583e37fd9e430a7ec95936c806570b";

const gatewayPublicKey = "A20KrD7xDmkFXpNMqJn1CLpRaDLcdKpO1NdBBS7VpWh3";
const publicClientAbi: any[] = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  { inputs: [], name: "InvalidBytesLength", type: "error" },
  { inputs: [], name: "InvalidInitialization", type: "error" },
  { inputs: [], name: "InvalidPacketSignature", type: "error" },
  { inputs: [], name: "InvalidPayloadHash", type: "error" },
  { inputs: [], name: "InvalidSignature", type: "error" },
  { inputs: [], name: "InvalidSignatureLength", type: "error" },
  { inputs: [], name: "NotInitializing", type: "error" },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  { inputs: [], name: "PaidRequestFeeTooLow", type: "error" },
  { inputs: [], name: "TaskAlreadyCompleted", type: "error" },
  { inputs: [], name: "TooManyVRFRandomWordsRequested", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "version",
        type: "uint64",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "taskId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "callbackSuccessful",
        type: "bool",
      },
    ],
    name: "TaskCompleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "task_id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "source_network",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "user_address",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "routing_info",
        type: "string",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "payload_hash",
        type: "bytes32",
      },
      {
        components: [
          { internalType: "bytes", name: "user_key", type: "bytes" },
          { internalType: "bytes", name: "user_pubkey", type: "bytes" },
          { internalType: "string", name: "routing_code_hash", type: "string" },
          {
            internalType: "string",
            name: "task_destination_network",
            type: "string",
          },
          { internalType: "string", name: "handle", type: "string" },
          { internalType: "bytes12", name: "nonce", type: "bytes12" },
          {
            internalType: "uint32",
            name: "callback_gas_limit",
            type: "uint32",
          },
          { internalType: "bytes", name: "payload", type: "bytes" },
          { internalType: "bytes", name: "payload_signature", type: "bytes" },
        ],
        indexed: false,
        internalType: "struct Gateway.ExecutionInfo",
        name: "info",
        type: "tuple",
      },
    ],
    name: "logNewTask",
    type: "event",
  },
  {
    inputs: [{ internalType: "uint256", name: "_newTaskId", type: "uint256" }],
    name: "increaseTaskId",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "payoutBalance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_taskId", type: "uint256" },
      { internalType: "string", name: "_sourceNetwork", type: "string" },
      {
        components: [
          { internalType: "bytes32", name: "payload_hash", type: "bytes32" },
          { internalType: "bytes32", name: "packet_hash", type: "bytes32" },
          {
            internalType: "bytes20",
            name: "callback_address",
            type: "bytes20",
          },
          { internalType: "bytes4", name: "callback_selector", type: "bytes4" },
          {
            internalType: "bytes4",
            name: "callback_gas_limit",
            type: "bytes4",
          },
          { internalType: "bytes", name: "packet_signature", type: "bytes" },
          { internalType: "bytes", name: "result", type: "bytes" },
        ],
        internalType: "struct Gateway.PostExecutionInfo",
        name: "_info",
        type: "tuple",
      },
    ],
    name: "postExecution",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint32", name: "_numWords", type: "uint32" },
      { internalType: "uint32", name: "_callbackGasLimit", type: "uint32" },
    ],
    name: "requestRandomness",
    outputs: [{ internalType: "uint256", name: "requestId", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "_payloadHash", type: "bytes32" },
      { internalType: "address", name: "_userAddress", type: "address" },
      { internalType: "string", name: "_routingInfo", type: "string" },
      {
        components: [
          { internalType: "bytes", name: "user_key", type: "bytes" },
          { internalType: "bytes", name: "user_pubkey", type: "bytes" },
          { internalType: "string", name: "routing_code_hash", type: "string" },
          {
            internalType: "string",
            name: "task_destination_network",
            type: "string",
          },
          { internalType: "string", name: "handle", type: "string" },
          { internalType: "bytes12", name: "nonce", type: "bytes12" },
          {
            internalType: "uint32",
            name: "callback_gas_limit",
            type: "uint32",
          },
          { internalType: "bytes", name: "payload", type: "bytes" },
          { internalType: "bytes", name: "payload_signature", type: "bytes" },
        ],
        internalType: "struct Gateway.ExecutionInfo",
        name: "_info",
        type: "tuple",
      },
    ],
    name: "send",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "taskId",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "tasks",
    outputs: [
      {
        internalType: "bytes31",
        name: "payload_hash_reduced",
        type: "bytes31",
      },
      { internalType: "bool", name: "completed", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "upgradeHandler",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export {
  baseSepoliaPublicClientAddress,
  publicClientAbi,
  routingCodeHash,
  routingContract,
  gatewayPublicKey,
};