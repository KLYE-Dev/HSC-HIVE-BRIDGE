pragma solidity ^0.4.22;

import "./HiveValidator.sol";
import "./GloryHole.sol";

/** @title BlackHoleEosToAccount
 *
 * @dev It burns ERC20 tokens and log it with an associated EOS account.
 */
contract GloryHoleHiveAccount is HiveValidator, GloryHole{
    constructor(address _erc20Contract, uint _criticBlock, uint _minimumAmount) public
    GloryHole(_erc20Contract, _criticBlock, _minimumAmount)
    {
    }

    /** @dev It deadlocks your tokens and emit an event with amount and EOS account.
     */
    function teleport(string hiveAccount) public {
        require(isValidAccount(hiveAccount), "not valid HIVE account");
        super.teleport(hiveAccount);
    }
}
