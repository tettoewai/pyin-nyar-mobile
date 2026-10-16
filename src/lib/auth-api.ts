import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { clearSession, saveSession } from "./session";
import { api } from "./api";

export type User = {
  id: string;
  email: string;
  role: string;
  name: string | null;
  avatarUrl: string | null;
};
type Pair = { accessToken: string; refreshToken: string; expiresIn: number };

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
});

async function persist(pair: Pair) {
  await saveSession(pair.accessToken, pair.refreshToken, pair.expiresIn);
  return api<User>("/auth/me", { method: "GET" });
}

export const authApi = {
  me: () => api<User>("/auth/me", { method: "GET" }),
  requestOtp: (email: string, purpose: "signup" | "reset-password") =>
    api("/auth/otp/request", {
      method: "POST",
      body: JSON.stringify({ email, purpose }),
    }),
  signup: (b: {
    email: string;
    password: string;
    confirmPassword: string;
    otp: string;
  }) =>
    api<Pair>("/auth/sign-up", {
      method: "POST",
      body: JSON.stringify(b),
    }).then(persist),
  login: (email: string, password: string) =>
    api<Pair>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }).then(persist),
  google: async () => {
    await GoogleSignin.hasPlayServices();
    const r = await GoogleSignin.signIn();
    const idToken = r.data?.idToken;
    if (!idToken) throw new Error("No idToken from Google");
    return api<Pair>("/auth/google", {
      method: "POST",
      body: JSON.stringify({ idToken }),
    }).then(persist);
  },
  logout: async (refresh: string | null) => {
    try {
      if (refresh)
        await api("/auth/logout", {
          method: "POST",
          body: JSON.stringify({ refreshToken: refresh }),
        });
    } finally {
      await GoogleSignin.signOut().catch(() => null);
      await clearSession();
    }
  },
};
