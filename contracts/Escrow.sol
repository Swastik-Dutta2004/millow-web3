//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IERC721 {
    function transferFrom(
        address _from,
        address _to,
        uint256 _id
    ) external;
}

contract Escrow {
    address public lender;
    address payable public seller;
    address public inspector;
    address public nftAddress;

    constructor(
            address _nftAddress, 
            address payable _seller, 
            address _inspector, 
            address _lender
        ) {
            seller = _seller;
            inspector = _inspector;
            lender = _lender;
            nftAddress = _nftAddress;
    }

    function list(uint256 _nftID) public {
    IERC721(nftAddress).transferFrom(msg.sender,address(this), _nftID);
    }
}