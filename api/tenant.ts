import { client } from "../api";

export const fetchProfileInfo = () => {
  return client("/profiles");
};
