import axios from "axios";
import Toast from "react-native-toast-message";
import { storage, filterQueryResolver, clearToken, getData } from "../utils";

let requestURL = "";
let baseURL = "https://ccapinax.prospectsmb.com/v1";

// "https://ccapi.prospectsmb.com/v1";

const nonAuthRequiredUrls = [
  "/login",
  "/register",
  "/recovery",
  "/password/recovery",
  "/invitation",
  "/invitation/accept",
];
export const client = async (
  endPoint: string,
  {
    data,
    method = data ? "POST" : "GET",
    filters = {},
    headers,
    ...customConfig
  }: any = {}
) => {
  let defaultHeaders: { [key: string]: any } = {};
  const token = await getData("TKN")?.then((result) => {
    return result;
  });
  const tenant = await getData("TNT")?.then((result) => {
    return result;
  });

  if (
    typeof token === "string" &&
    tenant &&
    !nonAuthRequiredUrls.includes(endPoint)
  ) {
    defaultHeaders["X-AUTH-PROTOKEN"] = token;
    defaultHeaders["X-TENANT-ID"] = Number(tenant);
  }

  console.log(filters)

  const query = filterQueryResolver(filters);

  if (query) {
    requestURL = `${customConfig.uri || baseURL}${endPoint}?${query}`;
  } else {
    requestURL = `${customConfig.uri || baseURL}${endPoint}`;
  }

  const config = {
    url: requestURL,
    data,
    method,
    headers:
      endPoint === "/attachments"
        ? {
            ...defaultHeaders,
            ...headers,
            "content-type": "multipart/form-data",
          }
        : {
            ...defaultHeaders,
            ...headers,
          },
    ...customConfig,
  };
  console.log(requestURL, "requestURL");

  return axios
    .request(config)
    .then((res: { data: { data: any } }) => res?.data?.data)
    .catch((error: { response: { data: { error: { message: any } } } }) => {
      console.log(error?.response?.data, ";err");
      const errorMessage = error?.response?.data?.error?.message;
      Toast.show({
        type: "error",
        text2: errorMessage,
        topOffset: 50,
      });
      if (errorMessage === "Access token is wrong") {
        clearToken();
      }
      throw error;
    });
};
