const hre = require("hardhat");
const fs = require('fs');

async function main() {
  const Collection = await hre.ethers.getContractFactory("Collection");
  const collection = await Collection.deploy();
  await collection.deployed();
  console.log("Collection deployed to:", collection.address);

  const Nft = await hre.ethers.getContractFactory("NFT");
  const nft = await Nft.deploy();
  await nft.deployed();
  console.log("NFT deployed to:", nft.address);

  let config = `
  export const nftmarketaddress = "${nftMarket.address}"
  export const nftaddress = "${nft.address}"
  `

  let data = JSON.stringify(config)
  fs.writeFileSync('config.js', JSON.parse(data))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
