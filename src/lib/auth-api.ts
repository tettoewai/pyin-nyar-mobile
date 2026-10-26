import { clearSession, saveSession } from "./session";
import { api, type ApiResponse } from "./api";

export type User = {
  id: string;
  email: string;
  role: string;
  name: string | null;
  userName: string;
  avatarUrl: string | null;
};
type Pair = { accessToken: string; refreshToken: string; expiresIn: number };

function getGoogleSignin() {
  try {
    const { GoogleSignin } = require("@react-native-google-signin/google-signin") as typeof import("@react-native-google-signin/google-signin");
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    });
    return GoogleSignin;
  } catch {
    if (!__DEV__) {
      throw new Error(
        "Google Sign-in native module is missing. Rebuild the app with a development or production build.",
      );
    }
    console.warn(
      "[auth] Google Sign-in is unavailable in Expo Go. Run npx expo run:ios/android to enable it.",
    );
    return null;
  }
}

async function persist(pair: Pair) {
  await saveSession(pair.accessToken, pair.refreshToken, pair.expiresIn);
  return me();
}

async function me() {
  return api<ApiResponse<User>>("/auth/me", { method: "GET" }).then(
    (r) => r.data,
  );
}

export const authApi = {
  me,
  requestOtp: (email: string, purpose: "signup" | "reset-password") =>
    api("/auth/otp/request", {
      method: "POST",
      body: JSON.stringify({ email, purpose }),
    }),
  signup: (b: {
    email: string;
    password: string;
    userName: string;
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
    const GoogleSignin = getGoogleSignin();
    if (!GoogleSignin) {
      throw new Error("Google Sign-in is unavailable in Expo Go.");
    }
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
      getGoogleSignin()?.signOut().catch(() => null);
      await clearSession();
    }
  },
};
