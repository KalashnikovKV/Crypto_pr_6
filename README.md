# Upgradeable ERC20 Token Project

This project demonstrates an upgradeable ERC20 token implementation using the UUPS (Universal Upgradeable Proxy Standard) pattern from OpenZeppelin.

## 🎉 Successfully Deployed on Sepolia Testnet

**Proxy Contract (Main Address)**: [`0x81a2daA5a50CD7d343a4b51940caf70Fd2ba196F`](https://sepolia.etherscan.io/address/0x81a2daA5a50CD7d343a4b51940caf70Fd2ba196F)

**View on Etherscan**: [Sepolia Explorer](https://sepolia.etherscan.io/address/0x81a2daA5a50CD7d343a4b51940caf70Fd2ba196F)

### Deployed Contracts:
- **MyTokenV1 Implementation**: [`0xDE603BB43771555edB36f778154cc79D7d1eF4C9`](https://sepolia.etherscan.io/address/0xDE603BB43771555edB36f778154cc79D7d1eF4C9)
- **MyTokenV2 Implementation**: [`0x235e2759038189435732e92bFB8EFF589cC5135D`](https://sepolia.etherscan.io/address/0x235e2759038189435732e92bFB8EFF589cC5135D)
- **Proxy Contract**: [`0x81a2daA5a50CD7d343a4b51940caf70Fd2ba196F`](https://sepolia.etherscan.io/address/0x81a2daA5a50CD7d343a4b51940caf70Fd2ba196F) ⭐ **Use this address for interactions**

### Token Information:
- **Name**: MyToken
- **Symbol**: MTK
- **Version**: V2 (upgraded)
- **Network**: Sepolia Testnet

## Project Overview

This project includes:

- **MyToken.sol**: Original ERC20 token from previous assignment (non-upgradeable)
- **MyTokenV1.sol**: Upgradeable version of MyToken.sol using UUPS pattern
- **MyTokenV2.sol**: Upgraded version with additional `version()` function
- **MyTokenProxy.sol**: Wrapper for ERC1967Proxy for delegating calls to implementation contracts
- Deployment scripts with automatic testing and upgrade validation
- TypeScript integration tests using `mocha` and ethers.js

## Architecture

### UUPS Proxy Pattern

The project uses the **UUPS (Universal Upgradeable Proxy Standard)** pattern:

1. **MyToken.sol**: Original non-upgradeable ERC20 token (from previous assignment)
2. **MyTokenV1.sol**: Upgradeable version of MyToken.sol - contains the actual business logic
3. **MyTokenV2.sol**: Upgraded version with new `version()` function
4. **Proxy Contract** (ERC1967Proxy): Stores state and delegates calls to implementation
5. **Upgrade Mechanism**: Owner can upgrade the proxy to point to a new implementation

### Key Features

- ✅ Token balances preserved after upgrade
- ✅ Storage layout compatibility between V1 and V2
- ✅ Only owner can upgrade (via `_authorizeUpgrade`)
- ✅ New functionality added in V2 (`version()` function)

## Usage

### Compile Contracts

```shell
npx hardhat compile
```

### Deploy Upgradeable Token

The deployment script automatically:
1. Deploys MyTokenV1 implementation (upgradeable version of MyToken.sol)
2. Deploys ERC1967Proxy pointing to V1
3. Initializes the proxy with 1,000,000 tokens
4. Tests minting and transfers
5. Deploys MyTokenV2 implementation
6. Upgrades proxy to V2
7. Verifies balances and version function

**Deploy to local Hardhat network:**
```shell
npx hardhat run scripts/deploy-upgradeable.ts
```

**Deploy to Sepolia testnet:**

1. **Set up private key:**
   ```shell
   npx hardhat keystore set SEPOLIA_PRIVATE_KEY
   ```
   When prompted, enter your wallet's private key (starts with `0x`).
   
   ⚠️ **WARNING**: Use only a test account! Never use the private key from your main wallet with real funds.

2. **Set up RPC URL:**
   ```shell
   npx hardhat keystore set SEPOLIA_RPC_URL
   ```
   
   **Recommended RPC URLs (choose one):**
   - **PublicNode** (free, no registration): `https://ethereum-sepolia-rpc.publicnode.com`
   - **Ankr** (free, no registration): `https://rpc.ankr.com/eth_sepolia`
   - **Infura** (requires registration): `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`
   - **Alchemy** (requires registration): `https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY`
   
   **Where to get RPC URL:**
   - **Infura**: https://infura.io → Create project → Sepolia → Copy HTTPS URL
   - **Alchemy**: https://www.alchemy.com → Create app → Sepolia → Copy HTTPS URL

3. **Get Sepolia ETH:**
   - Use Sepolia Faucet: https://sepoliafaucet.com/
   - Or: https://faucet.quicknode.com/ethereum/sepolia
   - You need ~0.01-0.1 ETH for contract deployment

4. **Run deployment:**
   ```shell
   npx hardhat run scripts/deploy-upgradeable.ts --network sepolia
   ```
   
   On first run, Hardhat will prompt for keystore password (which you set when configuring keys).

### Running Tests

To run all the tests in the project:

```shell
npx hardhat test
```

You can also selectively run the Solidity or `mocha` tests:

```shell
npx hardhat test solidity
npx hardhat test mocha
```

## Contract Details

### MyToken.sol (Original)
- **Name**: MyToken
- **Symbol**: MTK
- **Type**: Non-upgradeable ERC20 token
- **Functions**: 
  - `mint(address to, uint256 amount)` - Owner only
  - Standard ERC20 functions

### MyTokenV1.sol (Upgradeable Version)
- **Based on**: MyToken.sol from previous assignment
- **Name**: MyToken
- **Symbol**: MTK
- **Initial Supply**: 1,000,000 MTK (configurable)
- **Functions**: 
  - `mint(address to, uint256 amount)` - Owner only
  - Standard ERC20 functions
- **Upgrade Pattern**: UUPS (Universal Upgradeable Proxy Standard)

### MyTokenV2.sol (Upgraded Version)
- **Inherits from**: MyTokenV1.sol
- Inherits all V1 functionality
- **New Function**: `version() returns (string)` - Returns "V2"
- Maintains storage layout compatibility with V1

### MyTokenProxy.sol (Proxy Contract)
- **Type**: ERC1967Proxy wrapper (UUPS pattern)
- **Purpose**: Stores state and delegates calls to implementation contracts
- **Upgrade Authorization**: Only owner can upgrade
- **State Storage**: All token balances stored in proxy storage

## Deployment Steps Explained

1. **Deploy MyTokenV1 Implementation**: Deploy the upgradeable version of MyToken.sol (logic only, no state)
2. **Deploy Proxy**: Deploy ERC1967Proxy with MyTokenV1 address and initialization data
3. **Initialize**: Proxy calls `initialize()` on MyTokenV1, setting up token name, symbol, and initial supply
4. **Interact**: Use proxy address to mint and transfer tokens (same as original MyToken.sol)
5. **Deploy MyTokenV2 Implementation**: Deploy MyTokenV2 contract (logic only) with new `version()` function
6. **Upgrade**: Call `upgradeTo(v2Address)` on proxy to switch implementation
7. **Verify**: Check that balances are preserved and `version()` returns "V2"

## Verification on Etherscan

After deployment, you can verify your contracts on Sepolia Etherscan:

1. **Proxy Contract** (Main Address): 
   - https://sepolia.etherscan.io/address/0x81a2daA5a50CD7d343a4b51940caf70Fd2ba196F
   - This is the address you should use for all interactions

2. **View Transactions**:
   - Click on "Transactions" tab to see all contract interactions
   - You should see: Mint, Transfer, and Upgrade transactions

3. **Check Token Information**:
   - Token name and symbol are displayed in "More Info" section
   - Token transfers are visible in "Token Transfers (ERC-20)" tab

4. **Verify Contract Code** (Optional):
   - Go to "Contract" tab
   - Click "Verify and Publish" to verify the contract source code

## Important Notes

- ⚠️ **Storage Layout**: V2 must maintain the same storage layout as V1 to preserve state
- ⚠️ **Initialization**: Implementation contracts use `initializer` instead of `constructor`
- ⚠️ **Upgrade Authorization**: Only the owner can call `upgradeToAndCall()`
- ⚠️ **Proxy Address**: Always interact with the proxy address, not the implementation address
- ✅ **Deployment Verified**: All contracts successfully deployed and tested on Sepolia testnet
