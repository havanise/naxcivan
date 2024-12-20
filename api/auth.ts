import { client } from "../api";

export const checkToken = async () => {
  return client("/checkAccessToken", {
    method: "POST",
  });
};

export const login = async (
  data: { email: any; password: any; deviceToken?: "" }[]
) => {
  const { email, password, deviceToken = null } = data[0];

  return client("/login", {
    data: {
      email,
      password,
      deviceToken,
    },
  });
};
