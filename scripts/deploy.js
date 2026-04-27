const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contract with address:", deployer.address);

  const Election = await hre.ethers.getContractFactory("UniversityElection");
  const election = await Election.deploy();
  await election.waitForDeployment();

  console.log("UniversityElection deployed to:", election.target);

  const artifact = require("../artifacts/contracts/UniversityElection.sol/UniversityElection.json");
  const contractData = {
    address: election.target,
    abi: artifact.abi
  };

  fs.writeFileSync(
    "frontend/src/contractInfo.js",
    `export const contractAddress = "${election.target}";\nexport const abi = ${JSON.stringify(artifact.abi, null, 2)};\n`
  );

  fs.writeFileSync("backend/contractAddress.json", JSON.stringify({ address: election.target }, null, 2));
  console.log("Updated frontend/src/contractInfo.js and backend/contractAddress.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
