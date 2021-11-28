<p align='center'>
    <img src="./img/logo.png" width=400/>
</p>

## HomeChain

Find, create, and sell NFT's around your owned real estate.

### What it does

HomeChain enables users to create either own NFT's around properties they own:

Users can create the terms of the NFT and allow others to deposit to it.
Proof of ownership,such as a title or deed, is uploaded on HomeChain. It then collects the user's signature and uploads it as an image file to the IPFS folder for the property.
After upload, prospective buyers/participants (up to the limit specified by the issuer) can discover previously-created listings and purchase units of ownership using attachment to the NFT metadata source of truth.

- Property NFTs can either be ownership-oriented or collectible (i.e. collectible commonly in the case of a celebrity or notable location).
- HomeChain's signature model could be extended to support arbitrary documents where a signature is tied to an esigned document on IPFS in the future.

Each property gets deployed as its own smart contract. With the price/appraised value of the property fixed to the contract (uses a Chainlink-enabled SmartZip API call).

<p><b>Note this app is a prototype and would need additional work to be production ready.</b></p>

### Requirements

HomeChain has the following environment variables for interfacing with core blockchain services:

<pre>
    REACT_APP_NFT_PORT_KEY=XXX # your nftport.xyz api key
    REACT_APP_STORAGE_KEY=XXX  # your web3.storage api key
    REACT_APP_MORALIS_ID=XXX # your moralis app id
    REACT_APP_MORALIS_SERVER=XXX # your moralis server id
    REACT_APP_ALCHEMY_KEY=XXX # your network-specific alchemy key
</pre>

Sponsors:
Chainlink: Each listed property is deployed as it's own distinct smart contract. The smart contract maintains the owner and listing terms, as well as all the payers.
Ceramic: Distributed mutable data storage for the marketplace metadata. Search support.
IPFS / Filecoin: Store associated files, signature, and proof of ownership (ex: deed/title).
NFTPort: NFT issuance for the issued real estate backed NFT (minting).
Alchemy

### Running the app

Define the above environment variables and run:

`yarn && yarn start`

By default, the app is configured for blockchain interactions against the `rinkeby` eth testnet.

<!--
Tap into the equity of your home.
-->

### Related links

https://www.forbes.com/sites/nataliakarayaneva/2021/04/08/nfts-work-for-digital-art-they-also-work-perfectly-for-real-estate/?sh=775f435e43f3

### Screenshots

#### Home page

<img src="./img/home.png" width=800/>

#### Creating a new listing

<img src="./img/info.png" width=800/>

#### Signature and proof of ownership document required for listing

<img src="./img/sign.png" width=800/>

#### Completed upload

<img src="./img/complete.png" width=800/>

#### Uploaded IPFS content (deed and signature)

<img src="./img/ipfs.png" width=800/>

#### NFT created on upload

<img src="./img/nftport.png" width=800/>

#### Once listed, property is available or search

<img src="./img/search.png" width=800/>

#### Property details page

<img src="./img/details.png" width=800/>

#### Owner history of a property

<img src="./img/history.png" width=800/>

#### Submit payment via unlock to participate in a listed NFT sale

<img src="./img/unlock.png" width=800/>

<!--

ex:
https://rinkeby.etherscan.io/tx/0x68888984adab214ceca46d539290b4e9fcc7851e80796723abf2a03ea58f07bb
https://ipfs.io/ipfs/bafybeigrilyu2oxnhywaqn6ff6wciqfyzf254mpmla4dc4sohuhbmcgpqm
---
Chainlink
Moralis
Filecoin

Demo flow:
* Stat/web news about home/housing market
* NFT platforms for real estate exist, but one of the biggest problems is governance.
* Capped out at 10%, can't relinquish more than that.
* Ex: 1.0 eth per 1% ownership (10 max percent, 10 participants), // effective default is 1 eth for 1% ~4k, ~400k net valuation.
* Create form flow having person upload proof of ownership of home
* Create terms to allow others to deposit to it
* Use react signature canvas to collect the user signature (checking against the deed) and uploading as an image file to the IPFS folder for the property.
* Show completion page (ceramic stream, ipfs folder, and nftport-created NFT).
* After being uploaded, prospective buyers/participants (up to the limit specified by the issuer) can purchase units of ownership around the NFT.
* Property NFT's uploaded can either be ownership-oriented or simply collectible (i.e. could be used in the case of a celebrity or notable location).
* Generate NFT after form completion
* Uploaded proof of ownership
- The technology here could be leveraged for other esignature purpsoes as well (beyond real estate), where you want to esign a document and have the signature tied to the document in a filecoin directory.
- This actually serves that purpose but with a self-signed title document.
* API call from chainlink to get house price estimate.
* Login (powered by moralis).
* Search listings (backed by moralis).

### Notes

One of the biggest problems is transferring and representing ownership of real estate on a blockchain is ensuring governance:

- Who enforces that the ownership is represented by this particular NFT?
- If ownership is distributed, who is responsible for maintaining the property?
- How are duplicate or unauthorized NFT's avoided?


Create a limited partnership (LP), issue a token on whatever blockchain you want. Make the bylaws of the LP state that ownership and voting rights for LP is dictated by ownership of said token. Transfer ownership of one or more pieces of real estate to the LP. Whether a single home or bundle. Now you have this LP which owns one or more assets, and you can transfer around ownership of the LP itself by just sending tokens around.

-->

### Future work

### Useful links

- https://chainlink-fall-hackathon-2021.devpost.com/ --

### Dev Notes
