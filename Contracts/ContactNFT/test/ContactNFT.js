const { expect } = require('chai');

describe('ContactNFT', function () {
  it('Deployment should assign the total supply of tokens to the owner', async function () {
    const [owner] = await ethers.getSigners();

    console.log('owner:', owner.address);

    const contactNFT = await ethers.getContractFactory('ContactNFT');
    const JPYC = new ethers.Contract(
      '0xE097d6B3100777DC31B34dC2c58fB524C2e76921',
      [
        'function approve(address _spender, uint256 _value) public returns (bool success)',
        'function balanceOf(address _owner) public view returns (uint256 balance)',
      ],
      owner
    );

    console.log('JPYC address:', JPYC.address);

    const deployedNFT = await contactNFT.deploy();
    await deployedNFT.deployTransaction.wait();
    console.log('NFT address:', deployedNFT.address);
    const tx1 = await JPYC.approve(deployedNFT.address, BigInt(10 ** 7));
    await tx1.wait();
    const tx2 = await deployedNFT.safeMint(owner.address);
    await tx2.wait();
    expect(await deployedNFT.balanceOf(owner.address)).to.equal(BigInt(1));
  });
});
