pragma solidity ^0.4.22;

import "./HiveValidator.sol";
import "./GloryHole.sol";

/** @title BlackHoleEosPublicKey
 *
 * @dev It burns ERC20 tokens and log it with an associated EOS public key.
 */
contract GloryHoleHivePublicKey is HiveValidator, GloryHole{
    constructor(address _erc20Contract, uint _criticBlock, uint _minimumAmount) public
    GloryHole(_erc20Contract, _criticBlock, _minimumAmount)
    {
    }

    /** @dev It deadlocks your tokens and emit an event with amount and EOS public key.
     */
    function teleport(string hivePublicKey) public {
        require(isValidKey(hivePublicKey), "not valid HIVE public key");
        super.teleport(hivePublicKey);
    }
}
