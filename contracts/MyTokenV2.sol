// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./MyTokenV1.sol";

/**
 * @title MyTokenV2
 * @dev Upgraded version of MyToken with version function
 * @notice This contract maintains storage layout compatibility with MyTokenV1
 * Inherits all functionality from MyTokenV1 and adds version() function
 */
contract MyTokenV2 is MyTokenV1 {
    /**
     * @dev Returns the version of the contract
     * @return Version string "V2"
     */
    function version() public pure returns (string memory) {
        return "V2";
    }

    /**
     * @dev Reinitializer for V2 upgrade
     * @notice This function can be called after upgrade to perform any V2-specific initialization
     */
    function reinitializeV2() public reinitializer(2) {
        // Any V2-specific initialization can be added here
        // Currently, no additional initialization is needed
    }
}

