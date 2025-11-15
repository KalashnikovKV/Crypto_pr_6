import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect({
    network: "hardhatMainnet",
    chainType: "l1",
  });
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contract with account:", deployer.address);

  const myToken = await ethers.deployContract("MyToken", [
    ethers.parseEther("1000000"),
  ]);

  await myToken.waitForDeployment();
  const address = await myToken.getAddress();

  console.log("MyToken deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
