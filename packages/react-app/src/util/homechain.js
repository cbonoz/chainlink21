// d.title, d.description, d.owner, d.eth, d.limit, d.percent
import { ethers } from "ethers";

export const deployContract = async ({ title, description, limit, percent, eth }) => {
  const contractArgs = [title, description, limit, percent, eth];
  const contractArtifacts = await ethers.getContractFactory(contractName, {
    libraries: libraries,
  });
  const deployed = await contractArtifacts.deploy(...contractArgs, overrides);
  return deployed;
};
