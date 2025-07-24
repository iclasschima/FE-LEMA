import { User } from "../types";

export const formatAddress = (address: User["address"]): string => {
  const { street, state, city, zipcode } = address;
  return `${street}, ${state}, ${city}, ${zipcode}`;
};
