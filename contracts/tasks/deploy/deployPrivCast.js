const { networks } = require("../../networks");

task("deploy-priv-cast", "Deploys the PrivCast contract")
  .addOptionalParam(
    "verify",
    "Set to true to verify contract",
    false,
    types.boolean
  )
  .setAction(async (taskArgs) => {
    console.log(`Deploying PrivCast contract to ${network.name}`);

    console.log("\n__Compiling Contracts__");
    await run("compile");

    const anonAadharVerifier = "0xA09E07Cc47eF94eF56eC5DcF338379AD86A2DF4B"; // Scroll Sepolia Anon Aadhar Verifier
    const privCastContractFactory = await ethers.getContractFactory("PrivCast");
    const privCastContract = await privCastContractFactory.deploy(
      anonAadharVerifier
    );

    console.log(
      `\nWaiting ${
        networks[network.name].confirmations
      } blocks for transaction ${
        privCastContract.deployTransaction.hash
      } to be confirmed...`
    );

    await privCastContract.deployTransaction.wait(
      networks[network.name].confirmations
    );

    console.log("\nDeployed PrivCast contract to:", privCastContract.address);

    if (network.name === "localFunctionsTestnet") {
      return;
    }

    const verifyContract = taskArgs.verify;
    if (
      network.name !== "localFunctionsTestnet" &&
      verifyContract &&
      !!networks[network.name].verifyApiKey &&
      networks[network.name].verifyApiKey !== "UNSET"
    ) {
      try {
        console.log("\nVerifying contract...");
        await run("verify:verify", {
          address: privCastContract.address,
          constructorArguments: [anonAadharVerifier],
        });
        console.log("Contract verified");
      } catch (error) {
        if (!error.message.includes("Already Verified")) {
          console.log(
            "Error verifying contract.  Ensure you are waiting for enough confirmation blocks, delete the build folder and try again."
          );
          console.log(error);
        } else {
          console.log("Contract already verified");
        }
      }
    } else if (verifyContract && network.name !== "localFunctionsTestnet") {
      console.log(
        "\nPOLYGONSCAN_API_KEY, ETHERSCAN_API_KEY or FUJI_SNOWTRACE_API_KEY is missing. Skipping contract verification..."
      );
    }

    console.log(
      `\n PrivCast contract deployed to ${privCastContract.address} on ${network.name}`
    );
  });
