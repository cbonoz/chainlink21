pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract HomeFiContract is ChainlinkClient {
  using Chainlink for Chainlink.Request;


  string title = ""; // Title of contract (property address)
  string description = ""; // Description of contract
  address owner; // Issuer
  uint limit; // participant limit.
  uint percent;
  uint price;

  address private oracle;
  bytes32 private jobId;
  uint256 private fee;

  bytes32 public estimate;
  string public lastData;

  uint numberParticipants;

  mapping(address => uint) public participants;
  mapping(bytes32 => bytes32) propertyData;

  constructor(
    string memory _title, 
    string memory _description, 
    uint _limit, 
    uint _percent, 
    uint _price) public {
      // Set contract properties.
      owner = msg.sender;
      title = _title;
      description = _description;
      limit = _limit;
      price = _price;
      percent = _percent;
      numberParticipants = 0;

      // Chainlink rinkeby devrel node.
      oracle = 0xc57B33452b4F7BB189bB5AfaE9cc4aBa1f7a4FD8;
      jobId = "6b88e0402e5d415eb946e528b8e0c7ba";
      fee = 0.1 * 10 ** 18; // (Varies by network and job) .1 Link
      // requestGeocode(_title);
  }

  function purchaseStake() public payable {
    require(msg.value == price, "Please send correct amount to contract.");
    require(numberParticipants < limit, "This contract is oversubscribed or full.");

    // Add the sender as a participant.
    numberParticipants += 1;
    participants[msg.sender] = 1;
  }

    /**
     * Create a Chainlink request to retrieve API response, find the target
     * data, then multiply by 1000000000000000000 (to remove decimal places from data).
     * https://docs.chain.link/docs/advanced-tutorial/
     */
    function requestGeocode(string memory name, string memory field) public returns (bytes32 requestId) 
    {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        string memory requestUrl = string(abi.encodePacked("https://geocode.xyz/", name, "?json=1"));
        request.add("get", requestUrl);
        request.add("path", field);
        
        // Sends the request
        return sendChainlinkRequestTo(oracle, request, fee);
    }
    
    function fulfill(bytes32 _requestId, bytes32 _value) public recordChainlinkFulfillment(_requestId)
    {
        lastData = string(abi.encodePacked(_value));
    }

  // Views functions.

  function getTitle() public view returns (string memory) {
      return title;
  }

  function getOwner() public view returns (address) {
      return owner;
  }

  function getPercent() public view returns (uint) {
      return percent;
  }

  function getPrice() public view returns (uint) {
      return price;
  }

  function getLastData() public view returns (string memory) {
      return lastData;
  }

}
