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

    modifier onlySeller(){
       require(msg.sender == seller, "only seller can call method");
       _;
    }


    mapping (uint256 =>  bool) public isListed;
    mapping (uint256 =>  uint256) public purchaseprice;
    mapping (uint256 =>  uint256) public escrowAmount;
    mapping (uint256 =>  address) public buyer;


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

    function list(uint256 _nftID,uint256 _purchaseprice, uint256 _escrowAmount,address _buyer)public payable onlySeller {
    IERC721(nftAddress).transferFrom(msg.sender,address(this), _nftID);

    isListed[_nftID] = true;
    purchaseprice[_nftID] = _purchaseprice;
    escrowAmount[_nftID] = _escrowAmount;
    buyer[_nftID] = _buyer;
    }
}