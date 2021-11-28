import axios from "axios";
import { NFT_PORT_KEY } from "../constants";

export const createNftFromFileData = (name, description, data, ownerAddress, chain) => {
  const params = { chain: chain || "rinkeby", mint_to_address: ownerAddress, description, name };

  const formData = new FormData();
  const blob = new Blob([]) || data; // Should be data, but can use web3.storage as source of truth, seeing 502's.
  formData.append("file", blob, data.name);

  var options = {
    method: "POST",
    url: "https://api.nftport.xyz/v0/mints/easy/files",
    params,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: NFT_PORT_KEY,
      "content-type": "multipart/form-data; boundary=---011000010111000001101001",
    },
    data: formData,
  };

  return axios.request(options);
};
