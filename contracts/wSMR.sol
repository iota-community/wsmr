// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract wSMR is ERC20, ERC20Votes {

    event  Deposit(address indexed dst, uint wad);
    event  Withdrawal(address indexed src, uint wad);

    constructor()
        ERC20("wSMR", "wSMR") 
        ERC20Permit("wSMR")
    {}
    
    // The following 2 functions are there to override the ERC20Votes behavior of 
    // using block numbers to measure time, replacing them with measuring time through
    // the blocks timestamps instead.
    function clock() public view override returns (uint48) {
        return uint48(block.timestamp);
    }

    function CLOCK_MODE() public pure override returns (string memory) {
        return "mode=timestamp";
    }

    function _afterTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._burn(account, amount);
    }
    
    // We use 6 decimals given the native SMR token has no more
    function decimals() public view virtual override(ERC20) returns (uint8) {
        return 6;
    }  
    
    // Convert to wSMR if someone sends SMR to this contract address instead of calling deposit
    receive() external payable {
        deposit();
    }

    // The Native EVM Token always has 18 decimals, this is what clients expect.
    // Given SMR only has 6, the decimals are padded for the native asset to 18 decimals
    // When converting between native asset and wSMR we fix the decimals so they are
    // aligned with the actual SMR asset.
    function deposit() public payable {
        _mint(msg.sender, msg.value / 1e12);
        emit Deposit(msg.sender, msg.value / 1e12);
    }

    function withdraw(uint wad) public {
        require(balanceOf(msg.sender) >= wad, "Not enough wSMR to Withdraw");
        _burn(msg.sender, wad);
        payable(msg.sender).transfer(wad * 1e12);
        emit Withdrawal(msg.sender, wad);
    }

}
