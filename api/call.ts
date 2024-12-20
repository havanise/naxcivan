import { client } from "./axios-config";

export const getCall = async (filter: any[]) => {
  return client(`/tty/requests`, {
    method: "GET",
    filters: filter,
  });
};

export const fetchCallCount = async (filter: any[]) => {
  return client(`/tty/requests/count`, {
    method: "GET",
    filters: filter,
  });
};

export const updateRequestStatus = async (filter: any) => {
  return client(`/tty/requests/${filter.id}/setStatus/${filter.status}`, {
    method: "PUT",
    filters: {},
  });
};

export const closeRequest = async (filter: any) => {
  return client(`/tty/requests/${filter.id}/close`, {
    method: "PUT",
    data: filter.data,
    filters: {},
  });
};

export const fetchCallDetail = async (filter: any) => {
  return client(`/tty/requests/${filter.id}`, {
    method: "GET",
    filters: {},
  });
};

export const updateAmbulanceRequest = async (filter: any) => {
  return client(`/tty/requests/ambulance/${filter.id}`, {
    method: "PUT",
    data: filter.data,
    filters: {},
  });
};

export const fetchRequestComments = async (filter: any) => {
  return client(`/tty/requests/${filter.id}/messages?`, {
    method: "GET",
    filters: {},
  });
};

export const createComment = async (filter: any) => {
  return client(`/tty/requests/${filter.id}/messages`, {
    method: "POST",
    data: filter.data,
    filters: {},
  });
};

export const uploadAttachment = async (filter: any) => {
  return client(`/attachments`, {
    method: "POST",
    data: filter?.data,
    filters: {},
  });
};

export const deleteAttachment = async (filter: any) => {
  return client(`/attachments/${filter?.id}`, {
    method: "DELETE",
    filters: {},
  });
};
