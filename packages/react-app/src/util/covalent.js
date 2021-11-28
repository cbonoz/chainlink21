import { COVALENT_KEY, MAIN_CHAIN_ID } from "../constants";
import axios from "axios";

const COVALENT_BASE_API = "https://api.covalenthq.com/v1";

export const getTransactions = address => {
  const url = `${COVALENT_BASE_API}/${MAIN_CHAIN_ID}/address/${address}/transactions_v2/?&key=${COVALENT_KEY}`;
  return axios.get(url);
};
