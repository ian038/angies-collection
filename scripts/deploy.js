const hre = require("hardhat");

async function main() {
  const Collection = await hre.ethers.getContractFactory("Collection");
  const collection = await Collection.deploy();
  await collection.deployed();
  console.log("Collection deployed to:", collection.address);

  const Nft = await hre.ethers.getContractFactory("NFT");
  const nft = await Nft.deploy();
  await nft.deployed();
  console.log("NFT deployed to:", nft.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
