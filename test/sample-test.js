const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Collections", function () {
  it("Should create and list items", async function () {
    const Collection = await ethers.getContractFactory('Collection')
    const collection = await Collection.deploy()
    await collection.deployed()

    const NFT = await ethers.getContractFactory('NFT')
    const nft = await NFT.deploy()
    await nft.deployed()
    const nftAddress = nft.address

    await nft.createToken("https://www.mytokenlocation.com")
    await nft.createToken("https://www.mytokenlocation2.com")

    await collection.createCollectionItem(nftAddress, 1)
    await collection.createCollectionItem(nftAddress, 2)

    let items = await collection.fetchMyNFTs()
    items = await Promise.all(items.map(async i => {
      const tokenUri = await nft.tokenURI(i.tokenId)
      let item = {
        tokenId: i.tokenId.toString(),
        owner: i.owner,
        tokenUri
      }
      return item
    }))
    console.log('Items: ', items)
  });
});