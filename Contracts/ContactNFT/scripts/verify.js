const hre = require('hardhat');
require('dotenv').config({ path: '.env' });
require('@nomiclabs/hardhat-etherscan');

async function main() {
  // Verify the contract after deploying
  await hre.run('verify:verify', {
    address: '0x0F7834341f5EF5E0acf48F369dAED191AB3977e6',
    constructorArguments: [],
  });
}
// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
