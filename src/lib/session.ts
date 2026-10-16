import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const K = {
  access: "pyinnyar.access",
  refresh: "pyinnyar.refresh",
  expiry: "pyinnyar.expiry",
} as const;

const isNative = Platform.OS !== "web";

const web = {
  get: (k: string) => localStorage.getItem(k),
  set: (k: string, v: string) => localStorage.setItem(k, v),
  del: (k: string) => localStorage.removeItem(k),
};

export const saveSession = async (
  accessToken: string,
  refreshToken: string | null,
  expiresIn: number,
) => {
  const expiry = String(Date.now() + expiresIn * 1000);
  if (isNative) {
    await SecureStore.setItemAsync(K.access, accessToken);
    if (refreshToken) await SecureStore.setItemAsync(K.refresh, refreshToken);
    await SecureStore.setItemAsync(K.expiry, expiry);
  } else {
    web.set(K.access, accessToken);
    if (refreshToken) web.set(K.refresh, refreshToken);
    web.set(K.expiry, expiry);
  }
};

export const getTokens = async () => {
  if (isNative) {
    return {
      access: await SecureStore.getItemAsync(K.access),
      refresh: await SecureStore.getItemAsync(K.refresh),
      expiry: Number((await SecureStore.getItemAsync(K.expiry)) ?? 0),
    };
  }
  return {
    access: web.get(K.access),
    refresh: web.get(K.refresh),
    expiry: Number(web.get(K.expiry) ?? 0),
  };
};

export const clearSession = async () => {
  if (isNative)
    await Promise.all(
      [K.access, K.refresh, K.expiry].map((k) =>
        SecureStore.deleteItemAsync(k),
      ),
    );
  else [K.access, K.refresh, K.expiry].forEach(web.del);
};
