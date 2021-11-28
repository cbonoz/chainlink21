// import { NFTStorage, File } from "nft.storage";
import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js";
import { STORAGE_KEY } from "../constants";

const token = STORAGE_KEY;
const client = new Web3Storage({ token });

// Prepare files for storage as a property NFT listing.
export function makeListingFiles(uploadFiles, signatureData, metadata) {
  const files = [...uploadFiles, new File([signatureData], "signature.png")];
  if (metadata) {
    const blob = new Blob([JSON.stringify(metadata)], { type: "application/json" });
    const streamFile = new File([blob], "stream.json");
    files.push(streamFile);
  }
  return files;
}

export async function storeFiles(files) {
  const cid = await client.put(files);
  console.log("stored files with cid:", cid);
  return cid;
}

// const client = new NFTStorage({ token: apiKey });

// // https://nft.storage/#getting-started
// export const storeNFT = async (nftName, description, imageFile) => {
//   const metadata = await client.store({
//     name: nftName, // "Pinpie",
//     description, // "Pin is not delicious beef!",
//     image: imageFile,
//     //   image: new File(
//     //     [
//     //       /* data */
//     //     ],
//     //     "pinpie.jpg",
//     //     { type: "image/jpg" },
//     //   ),
//   });
//   console.log(metadata.url);
//   return metadata
// };
