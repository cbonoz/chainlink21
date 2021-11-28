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
    uint256 limit; // participant limit.
    uint256 percent;
    uint256 price;

    address private oracle;
    bytes32 private jobId;
    uint256 private fee;

    address private zipOracle;
    bytes32 private zipJobId;
    uint256 private zipFee;

    bytes32 public estimate;
    string public lastData;

    uint256 numberParticipants;

    mapping(address => uint256) public participants;
    mapping(bytes32 => bytes32) propertyData;

    constructor(
        string memory _title,
        string memory _description,
        uint256 _limit,
        uint256 _percent,
        uint256 _price
    ) public {
        // Set contract properties.
        owner = msg.sender;
        title = _title;
        description = _description;
        limit = _limit;
        price = _price;
        percent = _percent;
        numberParticipants = 0; // Active number of participants.

        // Chainlink rinkeby devrel node.
        oracle = 0xc57B33452b4F7BB189bB5AfaE9cc4aBa1f7a4FD8;
        jobId = "6b88e0402e5d415eb946e528b8e0c7ba";
        fee = 0.1 * 10**18; // (Varies by network and job) .1 Link
        // requestPropertyData(_title, "latt");

        // Note: smartzip invocable on mainnet only
        zipOracle = 0xCedA711FED764518654b53Dcf35356da87996B84;
        zipJobId = "94f9b202c7e04c988ce39674f825389d";
        zipFee = 1.0;
    }

    function purchaseStake() public payable {
        require(msg.value == price, "Please send correct amount to contract.");
        require(
            numberParticipants < limit,
            "This contract is oversubscribed or full."
        );

        // Add the sender as a participant.
        numberParticipants += 1;
        participants[msg.sender] = 1;
    }

    /**
     * https://docs.chain.link/docs/advanced-tutorial/
     */
    function requestPropertyData(string memory field)
        public
        returns (bytes32 requestId)
    {
        setPublicChainlinkToken();
        Chainlink.Request memory request = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfill.selector
        );
        string memory requestUrl = string(
            abi.encodePacked("https://geocode.xyz/", this.getTitle(), "?json=1")
        );
        request.add("get", requestUrl);
        request.add("path", field);

        // Sends the request
        return sendChainlinkRequestTo(oracle, request, fee);
    }

    function bytes32ToString(bytes32 _bytes32) public pure returns (string memory) {
        uint8 i = 0;
        while(i < 32 && _bytes32[i] != 0) {
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }

    function fulfill(bytes32 _requestId, bytes32 _value)
        public
        recordChainlinkFulfillment(_requestId)
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

    function getPercent() public view returns (uint256) {
        return percent;
    }

    function getPrice() public view returns (uint256) {
        return price;
    }

    function getLastData() public view returns (string memory) {
        return lastData;
    }

    // https://blog.chain.link/build-a-real-estate-dapp-with-chainlink-oracles/

    // For mainnet, this can be called as part of contract deployment
    // to preserve the approximate value of the home at time of issue.
    uint256 public smartZipEstimate;

    function requestDataSmartZip(
        address _oracle,
        bytes32 _jobId,
        string memory _propertyId
    ) public returns (bytes32 requestId) {
        Chainlink.Request memory req = buildChainlinkRequest(
            _jobId,
            address(this),
            this.fulfillSmartZip.selector
        );
        req.add("property_id", _propertyId);
        return sendChainlinkRequestTo(_oracle, req, zipFee);
    }

    function fulfillSmartZip(bytes32 _requestId, uint256 _data)
        public
        recordChainlinkFulfillment(_requestId)
    {
        smartZipEstimate = _data;
    }
}
