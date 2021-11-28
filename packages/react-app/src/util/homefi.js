// d.title, d.description, d.owner, d.eth, d.limit, d.percent
import { ethers } from "ethers";

export const deployContract = async (contractName, { title, description, limit, percent, eth }) => {
  let bytecode;
  let abi;
  try {
    bytecode = require(`../contracts/${contractName}.bytecode.js`);
    abi = require(`../contracts/${contractName}.abi.js`);
  } catch (e) {
    console.error("Error reading contract data", e, bytecode, abi);
  }
  // Create an instance of a Contract Factory
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const s = provider.getSigner();
  let factory = new ethers.ContractFactory(abi, bytecode, s); //, signer);
  const contractArgs = [title, description, limit, percent, eth];
  // const contractArtifacts = await ethers.getContractFactory(contractName, {});
  const body = {
    value: ethers.utils.parseEther("0.025"),
  };
  const deployed = await factory.deploy(...contractArgs);
  return deployed;
};
