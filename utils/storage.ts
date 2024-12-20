import AsyncStorage from "@react-native-async-storage/async-storage";

export const setData = async (name: string, value: string) => {
  try {
    await AsyncStorage.setItem(name, value);
  } catch (e) {
    console.log("saving error", e);
  }
};

export const getData = (name: string) => {
  try {
    const value = AsyncStorage.getItem(name);
    return value;
  } catch (e) {
    // error reading value
  }

  // try {
  //     return await AsyncStorage.getItem(`${name}`)
  // } catch (e) {
  //     console.log('error reading value', e)
  // }
};

const removeData = async (name: any) => {
  try {
    await AsyncStorage.removeItem(`${name}`);
  } catch (e) {
    console.log("remove error", e);
  }
};

export const storage = {
  get: (name: any) => getData(name),
  set: (name: any, value: any) => setData(name, value),
  remove: (name: any) => removeData(name),
};

export const saveToken = async (data: { accessToken: any; deviceToken: any; tenants: any; }) => {
  const { accessToken, deviceToken, tenants } = data;
  setData("TKN", accessToken);
  setData("DTKN", deviceToken);
  setData("TNT", `${tenants[0]?.id}`);
  return true;
};

export const saveBusinessUnit = async (businessUnit: any) => {
  setData("TKN_UNIT", `${businessUnit}`);
  return true;
};

export const clearBusinessUnit = async () => {
  storage.remove("TKN_UNIT");
  return true;
};

export const clearToken = async (reload = true) => {
  storage.remove("TKN");
  storage.remove("DTKN");
  storage.remove("TNT");
  storage.remove("TKN_UNIT");
  if (reload) {
    return true;
  }
};
