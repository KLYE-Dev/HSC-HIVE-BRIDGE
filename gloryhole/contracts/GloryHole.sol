pragma solidity ^0.4.22;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

/** @title GloryHole
 *
 * @dev Implementation of the GloryHole contract.
 * It deadlocks ERC20 tockens and emit events on success.
 */
contract GloryHole {
    event Opened();
    event Teleport(uint amount, string note);
    event Closed();

    bool public closed = false;
    ERC20 public erc20Contract;
    uint public criticBlock;
    uint public minimumAmount;

    /** @dev Construction of the ETH GloryHole contract.
     * @param _erc20Contract The address of the ERC20 contract to attract tockens from.
     * @param _criticBlock GloryHole can be closed after it.
     * @param _minimumAmount the smallest amount GloryHole can attract.
     */
    constructor(address _erc20Contract, uint _criticBlock, uint _minimumAmount) public {
        erc20Contract = ERC20(_erc20Contract);
        criticBlock = _criticBlock;
        minimumAmount = _minimumAmount;
        emit Opened();
    }

    /** @dev It closes the GloryHole if critical block has been reached.
     */
    function close() public {
        require(!closed, "This GloryHole contract's active period has expired.");
        require(block.number >= criticBlock, "GloryHole hasn't reached the critical mass");
        closed = true;
        emit Closed();
    }

    /** @dev teleport attracts tokens and emit Teleport event
     * @param note Teleport event note.
     */
    function teleport(string note) public {
        uint amount = attract();
        emit Teleport(amount, note);
    }

    function attract() private returns (uint amount){
        require(!closed, "GloryHole closed");
        uint balance = erc20Contract.balanceOf(msg.sender);
        uint allowed = erc20Contract.allowance(msg.sender, address(this));
        require(allowed >= minimumAmount, "less than minimum amount");
        require(balance == allowed, "GloryHole must attract all your tokens");
        require(erc20Contract.transferFrom(msg.sender, address(this), balance), "GloryHole can't attract your tokens");
        return balance;
    }
}
