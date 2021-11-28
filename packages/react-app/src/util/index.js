import faker from "faker";
import { DEFAULT_DESCRIPTION, DEFAULT_HOME_ICON } from "../constants";

export const USE_LOCAL = false

export const capitalize = s => {
  if (typeof s !== "string") return "";
  return (s.charAt(0).toUpperCase() + s.slice(1)).replace("-", " ");
};
export function bytesToSize(bytes) {
  var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes == 0) return "0 Byte";
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}

export const ipfsUrl = cid => `https://ipfs.io/ipfs/${cid}`;

export const createFullAddress = () =>
  `${faker.address.streetAddress()}, ${faker.address.city()} ${faker.address.stateAbbr()}`;

const TEST_CID = "bafybeihzu3d2ekfoyyr4wlwyzg6nf4i6qm2qhmsfatenurwxs6bewjchue";
// https://rinkeby.etherscan.io/tx/0xf802cdbf64af5bdbd7ad4935e694d144e7086bd9138f8f4b8091d9062df7fdbf
const createProperty = () => ({
  id: TEST_CID || faker.datatype.number(),
  title: faker.address.streetAddress(),
  eth: "1.0",
  description: DEFAULT_DESCRIPTION,
  imgUrl: undefined,
  nftContract: "0xf18eE101d2081478ce68Eab4E6B8f7Cb0fBBed4e",
});

export const DEMO_PROPERTIES = [createProperty(), createProperty(), createProperty()];

export const addCard = p => DEMO_PROPERTIES.push(p);
