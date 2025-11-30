// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

/**
 * @title MyTokenProxy
 * @dev Wrapper for ERC1967Proxy to enable Hardhat compilation
 * This contract simply re-exports ERC1967Proxy for deployment
 */
contract MyTokenProxy is ERC1967Proxy {
    constructor(address implementation, bytes memory _data) 
        ERC1967Proxy(implementation, _data) 
    {}
}

