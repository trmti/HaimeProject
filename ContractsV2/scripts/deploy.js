const hre = require('hardhat');
require('dotenv').config({ path: '.env' });
require('@nomiclabs/hardhat-etherscan');

async function main() {
  const FighterNFT = await hre.ethers.getContractFactory('FighterNFT');
  const NFT = await FighterNFT.deploy();

  await NFT.deployed();
  console.log('address:', NFT.address);
}
// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
