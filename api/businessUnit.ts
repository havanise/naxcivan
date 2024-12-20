import { client } from "./axios-config";

export const fetchBusinessSettings = async (filter: any) => {
  let businessUnitId = filter?.filter?.businessUnitIds?.[0] || 0;
  return client(
    `/business-unit/business-unit-tenant-person-setting/${filter.id}/${businessUnitId}`,
    {
      method: "GET",
      data: filter.data,
      filters: filter.filter,
    }
  );
};

export const fetchUnitBrigade = async (filter: any[]) => {
  return client(`/business-unit/business-unit-brigades`, {
    method: "GET",
    filters: filter?.[0],
  });
};

export const fetchMedInstitution = async (filter: any[]) => {
  return client(`/tty/medical-institutions`, {
    method: "GET",
    filters: filter?.[0],
  });
};
