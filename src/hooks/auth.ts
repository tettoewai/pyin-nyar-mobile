import { ApiError } from "@/lib/api";
import { authApi, User } from "@/lib/auth-api";
import { getTokens } from "@/lib/session";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5 * 60_1000, retry: 1 } },
});

export const SESSION_KEY = ["session"] as const;

export function useSession() {
  return useQuery<User | null>({
    queryKey: SESSION_KEY,
    queryFn: async () => {
      const { refresh } = await getTokens();
      if (!refresh) return null;
      try {
        return await authApi.me();
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) return null;
        throw e;
      }
    },
    retry: false,
  });
}

function useAuthMutation<TArgs extends unknown[], T = User>(
  fn: (...a: TArgs) => Promise<T>,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: TArgs) => fn(...args),
    onSuccess: (user) => qc.setQueryData(SESSION_KEY, user),
  });
}

export const useLogin = () =>
  useAuthMutation<[string, string]>((email, password) =>
    authApi.login(email, password),
  );
export const useSignup = () =>
  useAuthMutation<
    [{ email: string; password: string; confirmPassword: string; otp: string }]
  >((b) => authApi.signup(b));
export const useGoogleLogin = () => useAuthMutation<[]>(() => authApi.google());
export const useRequestOtp = () =>
  useMutation({
    mutationFn: (v: { email: string; purpose: "signup" | "reset-password" }) =>
      authApi.requestOtp(v.email, v.purpose),
  });
export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => authApi.logout((await getTokens()).refresh),
    onSettled: () => {
      qc.setQueryData(SESSION_KEY, null);
      qc.removeQueries({ queryKey: SESSION_KEY });
    },
  });
}
