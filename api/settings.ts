import { client } from "./axios-config";

export const fetchInitialDiagnoses = async (filter: any[]) => {
  return client(`/tty/diagnoses`, {
    method: "GET",
    filters: filter?.[0],
  });
};
