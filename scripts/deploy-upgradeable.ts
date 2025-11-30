import { network } from "hardhat";
import { ethers } from "ethers";

/**
 * Deployment script for upgradeable ERC20 token
 * 
 * This script deploys an upgradeable version of MyToken.sol from the previous assignment.
 * 
 * Steps:
 * 1. Deploy MyTokenV1 implementation (upgradeable version of MyToken.sol)
 * 2. Deploy ERC1967Proxy pointing to V1
 * 3. Initialize proxy with V1
 * 4. Test minting and transfers
 * 5. Deploy MyTokenV2 implementation (with version() function)
 * 6. Upgrade proxy to V2
 * 7. Verify upgrade (balances, version function)
 */
async function main() {
  const { ethers: ethersProvider } = await network.connect({
    network: "hardhatMainnet",
    chainType: "l1",
  });

  const [deployer, user1, user2] = await ethersProvider.getSigners();
  
  console.log("=".repeat(60));
  console.log("Deploying Upgradeable ERC20 Token");
  console.log("=".repeat(60));
  console.log("Deployer address:", deployer.address);
  console.log("User1 address:", user1.address);
  console.log("User2 address:", user2.address);
  console.log("");

  // Step 1: Deploy MyTokenV1 implementation (upgradeable version of MyToken.sol)
  console.log("Step 1: Deploying MyTokenV1 implementation (upgradeable MyToken)...");
  const MyTokenV1Factory = await ethersProvider.getContractFactory("MyTokenV1");
  const v1Implementation = await MyTokenV1Factory.deploy();
  await v1Implementation.waitForDeployment();
  const v1Address = await v1Implementation.getAddress();
  console.log("✓ MyTokenV1 implementation deployed to:", v1Address);
  console.log("");

  // Step 2: Prepare initialization data
  const initialSupply = ethers.parseEther("1000000");
  
  const v1Interface = MyTokenV1Factory.interface;
  const initData = v1Interface.encodeFunctionData("initialize", [
    initialSupply,
  ]);

  // Step 3: Deploy MyTokenProxy (ERC1967Proxy wrapper)
  console.log("Step 2: Deploying MyTokenProxy (ERC1967Proxy)...");
  const ProxyFactory = await ethersProvider.getContractFactory("MyTokenProxy");
  const proxy = await ProxyFactory.deploy(v1Address, initData);
  await proxy.waitForDeployment();
  const proxyAddress = await proxy.getAddress();
  console.log("✓ Proxy deployed to:", proxyAddress);
  console.log("");

  // Step 4: Connect to proxy as MyTokenV1
  console.log("Step 3: Connecting to proxy as MyTokenV1...");
  const tokenV1 = await ethersProvider.getContractAt("MyTokenV1", proxyAddress);
  const totalSupply = await tokenV1.totalSupply();
  const deployerBalance = await tokenV1.balanceOf(deployer.address);
  console.log("✓ Token name:", await tokenV1.name());
  console.log("✓ Token symbol:", await tokenV1.symbol());
  console.log("✓ Total supply:", ethers.formatEther(totalSupply));
  console.log("✓ Deployer balance:", ethers.formatEther(deployerBalance));
  console.log("");

  // Step 5: Test minting and transfers
  console.log("Step 4: Testing minting and transfers...");
  const mintAmount = ethers.parseEther("5000");
  const transferAmount = ethers.parseEther("1000");
  
  // Mint to user1
  const mintTx = await tokenV1.mint(user1.address, mintAmount);
  await mintTx.wait();
  const user1Balance = await tokenV1.balanceOf(user1.address);
  console.log("✓ Minted", ethers.formatEther(mintAmount), "tokens to user1");
  console.log("✓ User1 balance:", ethers.formatEther(user1Balance));
  
  // Transfer from user1 to user2
  const tokenV1AsUser1 = tokenV1.connect(user1);
  const transferTx = await tokenV1AsUser1.transfer(user2.address, transferAmount);
  await transferTx.wait();
  const user2Balance = await tokenV1.balanceOf(user2.address);
  console.log("✓ Transferred", ethers.formatEther(transferAmount), "tokens from user1 to user2");
  console.log("✓ User2 balance:", ethers.formatEther(user2Balance));
  console.log("");

  // Save balances before upgrade
  const balancesBeforeUpgrade = {
    deployer: await tokenV1.balanceOf(deployer.address),
    user1: await tokenV1.balanceOf(user1.address),
    user2: await tokenV1.balanceOf(user2.address),
  };
  console.log("Balances before upgrade:");
  console.log("  Deployer:", ethers.formatEther(balancesBeforeUpgrade.deployer));
  console.log("  User1:", ethers.formatEther(balancesBeforeUpgrade.user1));
  console.log("  User2:", ethers.formatEther(balancesBeforeUpgrade.user2));
  console.log("");

  // Step 6: Deploy MyTokenV2 implementation
  console.log("Step 5: Deploying MyTokenV2 implementation...");
  const MyTokenV2Factory = await ethersProvider.getContractFactory("MyTokenV2");
  const v2Implementation = await MyTokenV2Factory.deploy();
  await v2Implementation.waitForDeployment();
  const v2Address = await v2Implementation.getAddress();
  console.log("✓ MyTokenV2 implementation deployed to:", v2Address);
  console.log("");

  // Step 7: Upgrade proxy to V2
  console.log("Step 6: Upgrading proxy to V2...");
  // Use upgradeToAndCall with empty data (OpenZeppelin v5 uses upgradeToAndCall instead of upgradeTo)
  const upgradeTx = await tokenV1.upgradeToAndCall(v2Address, "0x");
  await upgradeTx.wait();
  console.log("✓ Upgrade transaction completed");
  console.log("");

  // Step 8: Connect to proxy as MyTokenV2 and verify
  console.log("Step 7: Verifying upgrade...");
  const tokenV2 = await ethersProvider.getContractAt("MyTokenV2", proxyAddress);
  
  // Check version
  const version = await tokenV2.version();
  console.log("✓ Version function returns:", version);
  
  // Check balances after upgrade
  const balancesAfterUpgrade = {
    deployer: await tokenV2.balanceOf(deployer.address),
    user1: await tokenV2.balanceOf(user1.address),
    user2: await tokenV2.balanceOf(user2.address),
  };
  
  console.log("Balances after upgrade:");
  console.log("  Deployer:", ethers.formatEther(balancesAfterUpgrade.deployer));
  console.log("  User1:", ethers.formatEther(balancesAfterUpgrade.user1));
  console.log("  User2:", ethers.formatEther(balancesAfterUpgrade.user2));
  
  // Verify balances are unchanged
  const balancesMatch = 
    balancesBeforeUpgrade.deployer === balancesAfterUpgrade.deployer &&
    balancesBeforeUpgrade.user1 === balancesAfterUpgrade.user1 &&
    balancesBeforeUpgrade.user2 === balancesAfterUpgrade.user2;
  
  if (balancesMatch) {
    console.log("✓ All balances preserved after upgrade!");
  } else {
    console.log("✗ ERROR: Balances changed after upgrade!");
  }
  
  // Verify token metadata
  console.log("✓ Token name:", await tokenV2.name());
  console.log("✓ Token symbol:", await tokenV2.symbol());
  console.log("✓ Total supply:", ethers.formatEther(await tokenV2.totalSupply()));
  console.log("");

  console.log("=".repeat(60));
  console.log("Deployment Summary");
  console.log("=".repeat(60));
  console.log("MyTokenV1 Implementation:", v1Address);
  console.log("MyTokenV2 Implementation:", v2Address);
  console.log("Proxy Address:", proxyAddress);
  console.log("Token Name: MyToken");
  console.log("Token Symbol: MTK");
  console.log("Version:", version);
  console.log("=".repeat(60));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

