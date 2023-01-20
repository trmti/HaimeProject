// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FanclubNFT is ERC721, ERC721Burnable, AccessControlEnumerable {
    using Counters for Counters.Counter;
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    address withdrawAddress;
    mapping (uint256 => uint) mintedDate;

    IERC20 JPYC = IERC20(0x6AE7Dfc73E0dDE2aa99ac063DcF7e8A63265108c); // JPYC address

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("ContactNFT", "FCN") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        withdrawAddress = msg.sender;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://jsonkeeper.com/b/ZG85";
    }

    function safeMint(address to) public onlyRole(MINTER_ROLE) {
        require(balanceOf(msg.sender) == 0, "This NFT is limited to one per person");
        require(JPYC.transferFrom(msg.sender, address(this), 10)); // tokenAmount
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        mintedDate[tokenId] = block.timestamp;
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireMinted(tokenId);

        string memory baseURI = _baseURI();
        return baseURI;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControlEnumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // original functions

    function getMintedDate(uint256 id) public view returns (uint) {
        return mintedDate[id];
    }

    function setWithdrawAccount(address withdrawer) public {
        require(msg.sender == withdrawAddress, "You can't call this function.");
        withdrawAddress = withdrawer;
    }

    function withdrawJPYC() public onlyRole(MINTER_ROLE) {
        JPYC.transfer(withdrawAddress, JPYC.balanceOf(address(this)));
    }
}