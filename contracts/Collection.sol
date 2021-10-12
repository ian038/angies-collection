// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract Collection is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;

    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }

    struct CollectionItem {
        uint itemId;
        address nftContract;
        uint256 tokenId;
        address payable owner;
    }

    mapping(uint256 => CollectionItem) private idToCollectionItem;

    event CollectionItemCreated (
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address owner
    );

    function createCollectionItem(address nftContract, uint256 tokenId) public payable nonReentrant {
        _itemIds.increment();
        uint256 itemId = _itemIds.current();
    
        idToCollectionItem[itemId] =  CollectionItem(
        itemId,
        nftContract,
        tokenId,
        payable(msg.sender)
        );

        emit CollectionItemCreated(
        itemId,
        nftContract,
        tokenId,
        msg.sender
        );
    }

      /* Returns items in collection */
    function fetchCollectionItems() public view returns (CollectionItem[] memory) {
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        CollectionItem[] memory items = new CollectionItem[](itemCount);
        // for (uint i = 0; i < totalItemCount; i++) {
        //     if (idToCollectionItem[i + 1].owner == msg.sender) {
        //         uint currentId = i + 1;
        //         CollectionItem storage currentItem = idToCollectionItem[currentId];
        //         items[currentIndex] = currentItem;
        //         currentIndex += 1;
        //     }
        // }
        for (uint i = 0; i < totalItemCount; i++) {
            uint currentId = i + 1;
            CollectionItem storage currentItem = idToCollectionItem[currentId];
            items[currentIndex] = currentItem;
            currentIndex += 1;
        }
        return items;
    }
}