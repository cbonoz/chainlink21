// deploy/00_deploy_your_contract.js

//const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  await deploy("HomeFiContract", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [
      "4 Strathmore Rd.",
      "Own 1% of this property",
      10,
      10,
      ethers.utils.parseEther("1.0"),
    ],
    log: true,
  });

  /*
    // Getting a previously deployed contract
    const HomeFiContract = await ethers.getContract("HomeFiContract", deployer);
    await HomeFiContract.setPurpose("Hello");
  
    To take ownership of HomeFiContract using the ownable library uncomment next line and add the 
    address you want to be the owner. 
    // HomeFiContract.transferOwnership(YOUR_ADDRESS_HERE);

    //const HomeFiContract = await ethers.getContractAt('HomeFiContract', "0xaAC799eC2d00C013f1F11c37E654e59B0429DF6A") //<-- if you want to instantiate a version of a contract at a specific address!
  */

  /*
  //If you want to send value to an address from the deployer
  const deployerWallet = ethers.provider.getSigner()
  await deployerWallet.sendTransaction({
    to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    value: ethers.utils.parseEther("0.001")
  })
  */

  /*
  //If you want to send some ETH to a contract on deploy (make your constructor payable!)
  const HomeFiContract = await deploy("HomeFiContract", [], {
  value: ethers.utils.parseEther("0.05")
  });
  */

  /*
  //If you want to link a library into your contract:
  // reference: https://github.com/austintgriffith/scaffold-eth/blob/using-libraries-example/packages/hardhat/scripts/deploy.js#L19
  const HomeFiContract = await deploy("HomeFiContract", [], {}, {
   LibraryName: **LibraryAddress**
  });
  */
};
module.exports.tags = ["HomeFiContract"];
