// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/**
 * @title MyTokenV1
 * @dev Upgradeable version of MyToken.sol from previous assignment
 * @notice This contract uses UUPS (Universal Upgradeable Proxy Standard) pattern
 * This is the upgradeable implementation of the original MyToken contract
 */
contract MyTokenV1 is ERC20Upgradeable, OwnableUpgradeable, UUPSUpgradeable {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initializes the contract with initial supply
     * @param initialSupply Initial token supply to mint to deployer
     * @notice Uses "MyToken" and "MTK" as name and symbol (matching original MyToken.sol)
     */
    function initialize(uint256 initialSupply) public initializer {
        __ERC20_init("MyToken", "MTK");
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        _mint(msg.sender, initialSupply);
    }

    /**
     * @dev Mints new tokens to a specified address.
     * @param to The address to mint tokens to.
     * @param amount The amount of tokens to mint.
     * @notice Only the owner can call this function.
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Authorizes upgrade (required by UUPS pattern)
     * @param newImplementation Address of the new implementation contract
     * @notice Only the owner can authorize upgrades
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}

