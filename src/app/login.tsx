import { ThemedIcon } from "@/components/ui/icon";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import {
  useGoogleLogin,
  useLogin,
  useRequestOtp,
  useSignup,
} from "@/hooks/auth";
import { ApiError } from "@/lib/api";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckIcon,
  CircleAlert,
  EyeIcon,
  EyeOffIcon,
  GraduationCap,
  KeyRound,
  Lock,
  Mail,
  Send,
  ShieldCheck,
} from "lucide-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_RESEND_SECONDS = 30;

function GoogleMark() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24">
      <Path
        fill="#4285F4"
        d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.09 3.57-5.16 3.57-8.81Z"
      />
      <Path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.1A12 12 0 0 0 12 24Z"
      />
      <Path
        fill="#FBBC05"
        d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28v-3.1H1.29a12 12 0 0 0 0 10.76l3.98-3.1Z"
      />
      <Path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.61 4.58 1.8l3.44-3.44A11.98 11.98 0 0 0 12 0 12 12 0 0 0 1.29 6.62l3.98 3.1C6.22 6.88 8.87 4.77 12 4.77Z"
      />
    </Svg>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <View className="mt-2 flex-row items-start gap-1.5">
      <ThemedIcon
        as={CircleAlert}
        size={14}
        className="mt-0.5 shrink-0 text-destructive"
      />
      <Text
        className="flex-1 text-xs leading-5 text-destructive"
        numberOfLines={2}
      >
        {message}
      </Text>
    </View>
  );
}

export default function LoginPage() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const placeholderColor = colorScheme === "dark" ? "#A1ABA6" : "#8A90A6";
  const { page } = useLocalSearchParams<{ page?: string }>();

  const [isCreatingAccount, setIsCreatingAccount] = useState(
    page === "sign-up",
  );
  const [lastPage, setLastPage] = useState(page);
  // Sync mode when the ?page= param changes (e.g. deep link).
  // Render-time adjustment: re-renders before commit, no flicker.
  if (page !== lastPage) {
    setLastPage(page);
    setIsCreatingAccount(page === "sign-up");
  }
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [touched, setTouched] = useState({
    email: false,
    code: false,
    password: false,
    confirm: false,
  });
  const [focused, setFocused] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [codeSent, setCodeSent] = useState(false);

  const emailRef = useRef<any>(null);
  const codeRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);
  const confirmRef = useRef<any>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const fieldGap = "mb-2";
  const lastFieldGap = "mb-2.5";

  const passwordChecks = useMemo(
    () => ({
      length: password.length >= 6,
      number: /\d/.test(password),
      symbol: /[^A-Za-z0-9]/.test(password),
    }),
    [password],
  );

  const errors = useMemo(() => {
    const e: {
      email?: string;
      code?: string;
      password?: string;
      confirm?: string;
    } = {};
    if (!email.trim()) e.email = "Enter your email address.";
    else if (!EMAIL_RE.test(email.trim()))
      e.email = "That email doesn't look right — check for typos.";
    if (isCreatingAccount) {
      if (!code.trim()) e.code = "Enter the 6-digit code we sent you.";
      else if (!/^\d{6}$/.test(code.trim()))
        e.code = "Code should be 6 digits.";
      if (!password) e.password = "Choose a password.";
      else if (!passwordChecks.length)
        e.password = "Use at least 6 characters.";
      else if (!passwordChecks.number || !passwordChecks.symbol)
        e.password = "Add a number and a symbol for a stronger password.";
      if (!confirmPassword) e.confirm = "Re-enter your password.";
      else if (confirmPassword !== password)
        e.confirm = "Passwords don't match.";
    } else if (!password) {
      e.password = "Enter your password.";
    }
    return e;
  }, [
    email,
    code,
    password,
    confirmPassword,
    passwordChecks,
    isCreatingAccount,
  ]);

  const visibleErrors = {
    email: touched.email ? errors.email : undefined,
    code: touched.code ? errors.code : undefined,
    password: touched.password ? errors.password : undefined,
    confirm: touched.confirm ? errors.confirm : undefined,
  };

  const login = useLogin();
  const signup = useSignup();
  const requestOtp = useRequestOtp();
  const googleLogin = useGoogleLogin();
  const isSubmitting =
    login.isPending || signup.isPending || googleLogin.isPending;

  const getErrorMessage = (e: unknown, fallback: string) =>
    e instanceof ApiError ? e.message || fallback : fallback;

  const switchMode = (creating: boolean) => {
    setIsCreatingAccount(creating);
    setTouched({ email: false, code: false, password: false, confirm: false });
    setFormError(null);
    router.setParams({ page: creating ? "sign-up" : "sign-in" });
  };

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };

  const markAllTouched = () =>
    setTouched({ email: true, code: true, password: true, confirm: true });

  const handleSubmit = async () => {
    markAllTouched();
    if (isCreatingAccount) {
      if (errors.email || errors.code || errors.password || errors.confirm)
        return;
    } else if (errors.email || errors.password) {
      return;
    }
    setFormError(null);
    try {
      if (isCreatingAccount) {
        await signup.mutateAsync([
          {
            email: email.trim(),
            password,
            confirmPassword,
            otp: code.trim(),
          },
        ]);
      } else {
        await login.mutateAsync([email.trim(), password]);
      }
      router.replace("/private/(tabs)");
    } catch (e) {
      setFormError(
        getErrorMessage(
          e,
          isCreatingAccount
            ? "Sign-up failed. Try again."
            : "Sign-in failed. Try again.",
        ),
      );
    }
  };

  const handleSendCode = async () => {
    setTouched((t) => ({ ...t, email: true }));
    if (!EMAIL_RE.test(email.trim()) || cooldown > 0 || requestOtp.isPending)
      return;
    setFormError(null);
    try {
      await requestOtp.mutateAsync({
        email: email.trim(),
        purpose: "signup",
      });
      setCooldown(CODE_RESEND_SECONDS);
      setCodeSent(true);
      codeRef.current?.focus();
    } catch (e) {
      setFormError(getErrorMessage(e, "Couldn't send the code. Try again."));
    }
  };

  const handleGoogle = async () => {
    setFormError(null);
    try {
      await googleLogin.mutateAsync([]);
      router.replace("/private/(tabs)");
    } catch (e) {
      setFormError(getErrorMessage(e, "Google sign-in failed. Try again."));
    }
  };

  const inputBorder = (field: string, hasError?: string) =>
    hasError
      ? "border-destructive/60"
      : focused === field
        ? "border-ring"
        : "border-border";

  return (
    <View className="flex-1 bg-background">
      {/* Decorative wash */}
      <View pointerEvents="none" className="absolute inset-0">
        <View className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10" />
        <View className="absolute -left-28 top-40 h-72 w-72 rounded-full bg-secondary/10" />
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : 0}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingTop: insets.top + 6,
            paddingBottom: insets.bottom + 12,
            paddingHorizontal: 18,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top bar */}
          <View className="flex-row items-center justify-between mb-5">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={12}
              onPress={handleBack}
              className="h-10 w-10 items-center justify-center rounded-full border border-border bg-card active:opacity-70"
            >
              <ThemedIcon
                as={ArrowLeft}
                size={18}
                className="text-foreground"
              />
            </Pressable>
            <View className="flex-row items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5">
              <View className="h-6 w-6 items-center justify-center rounded-lg bg-primary">
                <ThemedIcon
                  as={GraduationCap}
                  size={14}
                  className="text-primary-foreground"
                />
              </View>
              <Text className="font-heading text-[11px] uppercase tracking-[2px] text-primary">
                Pyin Nyar • ပညာ
              </Text>
            </View>
          </View>

          {/* Heading */}
          <View className="items-start mb-4">
            <Text className="font-heading text-foreground text-[24px] leading-7">
              {isCreatingAccount ? "Create account" : "Welcome back"}
            </Text>
            <Text className="mt-1 text-xs leading-4 text-muted-foreground">
              {isCreatingAccount
                ? "Start your learning journey with Pyin Nyar."
                : "Continue your learning journey with Pyin Nyar."}
            </Text>
          </View>

          {/* Mode switcher */}
          <View
            accessibilityRole="tablist"
            className="mb-4 flex-row rounded-2xl border border-border/60 bg-muted/60 p-1"
          >
            {(
              [
                { label: "Sign in", value: false },
                { label: "Sign up", value: true },
              ] as const
            ).map((tab) => {
              const active = isCreatingAccount === tab.value;
              return (
                <Pressable
                  key={tab.label}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={tab.label}
                  onPress={() => switchMode(tab.value)}
                  className={`flex-1 rounded-xl py-2 ${
                    active ? "bg-card shadow-sm shadow-black/10" : ""
                  } active:opacity-80`}
                >
                  <Text
                    className={`text-center font-heading text-sm ${
                      active ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Form card */}
          <View className="rounded-[24px] border border-border/70 bg-card p-3.5 shadow-sm shadow-black/5">
            {/* Email */}
            <View className={fieldGap}>
              <Text className="mb-1.5 font-heading text-[13px] text-foreground">
                Email
              </Text>
              <Input
                isInvalid={!!visibleErrors.email}
                isDisabled={isSubmitting}
                className={`min-h-12 rounded-2xl border bg-muted/30 px-4 ${inputBorder("email", visibleErrors.email)}`}
              >
                <InputField
                  ref={emailRef}
                  value={email}
                  onChangeText={(v) => {
                    setEmail(v);
                    if (codeSent) setCodeSent(false);
                  }}
                  onBlur={() => {
                    setTouched((t) => ({ ...t, email: true }));
                    setFocused(null);
                  }}
                  onFocus={() => setFocused("email")}
                  type="text"
                  placeholder="you@example.com"
                  placeholderTextColor={placeholderColor}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  autoComplete="email"
                  returnKeyType="next"
                  onSubmitEditing={() =>
                    isCreatingAccount
                      ? codeRef.current?.focus()
                      : passwordRef.current?.focus()
                  }
                  blurOnSubmit={false}
                />
                <InputSlot className="pr-1">
                  <ThemedIcon
                    as={Mail}
                    size={17}
                    className="text-muted-foreground"
                  />
                </InputSlot>
              </Input>
              <FieldError message={visibleErrors.email} />
            </View>

            {/* Verification code (sign-up only) */}
            {isCreatingAccount ? (
              <View className={fieldGap}>
                <Text className="mb-1.5 font-heading text-[13px] text-foreground">
                  Email verification code
                </Text>
                <View className="flex-row items-center gap-2">
                  <Input
                    isInvalid={!!visibleErrors.code}
                    isDisabled={isSubmitting}
                    className={`min-h-12 min-w-0 flex-1 rounded-2xl border bg-muted/30 px-4 ${inputBorder("code", visibleErrors.code)}`}
                  >
                    <InputField
                      ref={codeRef}
                      value={code}
                      onChangeText={(v) =>
                        setCode(v.replace(/[^0-9]/g, "").slice(0, 6))
                      }
                      onBlur={() => {
                        setTouched((t) => ({ ...t, code: true }));
                        setFocused(null);
                      }}
                      onFocus={() => setFocused("code")}
                      type="text"
                      placeholder="6-digit code"
                      placeholderTextColor={placeholderColor}
                      keyboardType="number-pad"
                      textContentType="oneTimeCode"
                      autoComplete="sms-otp"
                      maxLength={6}
                      returnKeyType="next"
                      onSubmitEditing={() => passwordRef.current?.focus()}
                      blurOnSubmit={false}
                    />
                    <InputSlot className="pr-1">
                      <ThemedIcon
                        as={KeyRound}
                        size={16}
                        className="text-muted-foreground"
                      />
                    </InputSlot>
                  </Input>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={
                      cooldown > 0
                        ? `Resend code in ${cooldown} seconds`
                        : "Send verification code"
                    }
                    accessibilityState={{
                      disabled: cooldown > 0 || requestOtp.isPending,
                    }}
                    disabled={
                      cooldown > 0 || requestOtp.isPending || isSubmitting
                    }
                    onPress={handleSendCode}
                    className={`shrink-0 min-h-12 flex-row items-center justify-center gap-1.5 rounded-2xl border px-2.5 active:opacity-70 ${
                      cooldown > 0
                        ? "border-border bg-muted/50"
                        : "border-primary/25 bg-primary/10"
                    }`}
                  >
                    <ThemedIcon
                      as={Send}
                      size={13}
                      className={
                        cooldown > 0 ? "text-muted-foreground" : "text-primary"
                      }
                    />
                    <Text
                      className={`font-heading text-xs ${
                        cooldown > 0 ? "text-muted-foreground" : "text-primary"
                      }`}
                    >
                      {cooldown > 0
                        ? `${cooldown}s`
                        : requestOtp.isPending
                          ? "Sending…"
                          : codeSent
                            ? "Resend"
                            : "Send code"}
                    </Text>
                  </Pressable>
                </View>
                {codeSent ? (
                  <Text className="mt-1 text-[10px] leading-4 text-muted-foreground">
                    {`Code sent — check spam too.`}
                  </Text>
                ) : null}
                <FieldError message={visibleErrors.code} />
              </View>
            ) : null}

            {/* Password */}
            <View className={fieldGap}>
              <Text className="mb-1.5 font-heading text-[13px] text-foreground">
                Password
              </Text>
              <Input
                isInvalid={!!visibleErrors.password}
                isDisabled={isSubmitting}
                className={`min-h-12 rounded-2xl border bg-muted/30 px-4 ${inputBorder("password", visibleErrors.password)}`}
              >
                <InputField
                  ref={passwordRef}
                  value={password}
                  onChangeText={setPassword}
                  onBlur={() => {
                    setTouched((t) => ({ ...t, password: true }));
                    setFocused(null);
                  }}
                  onFocus={() => setFocused("password")}
                  placeholder={
                    isCreatingAccount
                      ? "Create a strong password"
                      : "Enter your password"
                  }
                  placeholderTextColor={placeholderColor}
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={!showPassword}
                  textContentType={
                    isCreatingAccount ? "newPassword" : "password"
                  }
                  autoComplete={
                    isCreatingAccount ? "new-password" : "current-password"
                  }
                  returnKeyType={isCreatingAccount ? "next" : "go"}
                  onSubmitEditing={() =>
                    isCreatingAccount
                      ? confirmRef.current?.focus()
                      : handleSubmit()
                  }
                />
                <InputSlot
                  className="px-2 py-2"
                  onPress={() => setShowPassword((v) => !v)}
                  accessibilityRole="button"
                  accessibilityLabel={
                    showPassword ? "Hide password" : "Show password"
                  }
                  accessibilityState={{ selected: showPassword }}
                  hitSlop={8}
                >
                  <ThemedIcon
                    as={showPassword ? EyeIcon : EyeOffIcon}
                    size={18}
                    className="text-muted-foreground"
                  />
                </InputSlot>
              </Input>
              <FieldError message={visibleErrors.password} />

              {isCreatingAccount ? (
                <View className="mt-1.5 flex-row flex-wrap gap-1.5">
                  {[
                    { ok: passwordChecks.length, label: "6+ characters" },
                    { ok: passwordChecks.number, label: "Number" },
                    { ok: passwordChecks.symbol, label: "Symbol" },
                  ].map((r) => (
                    <View
                      key={r.label}
                      className={`flex-row items-center gap-1.5 rounded-full px-2.5 py-1 ${
                        r.ok ? "bg-primary/10" : "bg-muted"
                      }`}
                    >
                      <ThemedIcon
                        as={CheckIcon}
                        size={11}
                        className={
                          r.ok ? "text-primary" : "text-muted-foreground"
                        }
                      />
                      <Text
                        className={`text-xs ${r.ok ? "text-primary" : "text-muted-foreground"}`}
                      >
                        {r.label}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>

            {/* Confirm password (sign-up) */}
            {isCreatingAccount ? (
              <View className={lastFieldGap}>
                <Text className="mb-1.5 font-heading text-[13px] text-foreground">
                  Confirm password
                </Text>
                <Input
                  isInvalid={!!visibleErrors.confirm}
                  isDisabled={isSubmitting}
                  className={`min-h-12 rounded-2xl border bg-muted/30 px-4 ${inputBorder("confirm", visibleErrors.confirm)}`}
                >
                  <InputField
                    ref={confirmRef}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    onBlur={() => {
                      setTouched((t) => ({ ...t, confirm: true }));
                      setFocused(null);
                    }}
                    onFocus={() => setFocused("confirm")}
                    placeholder="Re-enter your password"
                    placeholderTextColor={placeholderColor}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={!showConfirmPassword}
                    textContentType="newPassword"
                    autoComplete="new-password"
                    returnKeyType="go"
                    onSubmitEditing={handleSubmit}
                  />
                  <InputSlot
                    className="px-2 py-2"
                    onPress={() => setShowConfirmPassword((v) => !v)}
                    accessibilityRole="button"
                    accessibilityLabel={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    accessibilityState={{ selected: showConfirmPassword }}
                    hitSlop={8}
                  >
                    <ThemedIcon
                      as={showConfirmPassword ? EyeIcon : EyeOffIcon}
                      size={18}
                      className="text-muted-foreground"
                    />
                  </InputSlot>
                </Input>
                <FieldError message={visibleErrors.confirm} />
              </View>
            ) : null}

            {formError ? <FieldError message={formError} /> : null}

            {/* Submit — always tappable so invalid taps reveal errors. */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                isCreatingAccount ? "Create account" : "Sign in"
              }
              accessibilityState={{
                disabled: isSubmitting,
                busy: isSubmitting,
              }}
              disabled={isSubmitting}
              onPress={handleSubmit}
              className={`mb-2 flex-row items-center justify-center gap-2 rounded-2xl px-4 py-3 shadow-md shadow-primary/20 active:opacity-90 active:scale-[0.99] ${
                isSubmitting ? "bg-muted" : "bg-primary"
              }`}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#8A90A6" />
              ) : (
                <ThemedIcon
                  as={isCreatingAccount ? ShieldCheck : Lock}
                  size={17}
                  className="text-primary-foreground"
                />
              )}
              <Text
                className={`text-center font-heading text-[15px] ${
                  isSubmitting
                    ? "text-muted-foreground"
                    : "text-primary-foreground"
                }`}
              >
                {isSubmitting
                  ? "Please wait…"
                  : isCreatingAccount
                    ? "Create account"
                    : "Sign in"}
              </Text>
              {!isSubmitting ? (
                <ThemedIcon
                  as={ArrowRight}
                  size={17}
                  className="text-primary-foreground"
                />
              ) : null}
            </Pressable>

            {isCreatingAccount ? (
              <Text className="mb-2 text-center text-[10px] leading-4 text-muted-foreground">
                By signing up you agree to our Terms and Privacy Policy.
              </Text>
            ) : (
              <>
                <View className="mb-2 flex-row items-center gap-2">
                  <View className="h-px flex-1 bg-border" />
                  <Text className="text-[10px] uppercase tracking-[2px] text-muted-foreground">
                    Or continue with
                  </Text>
                  <View className="h-px flex-1 bg-border" />
                </View>

                <View className="mb-2 flex-row gap-2">
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Continue with Google"
                    accessibilityState={{
                      disabled: isSubmitting,
                      busy: googleLogin.isPending,
                    }}
                    disabled={isSubmitting}
                    onPress={handleGoogle}
                    className="min-h-12 flex-1 flex-row items-center justify-center gap-2 rounded-2xl border border-border bg-card px-2.5 active:bg-muted/50 active:opacity-90"
                  >
                    {googleLogin.isPending ? (
                      <ActivityIndicator size="small" color="#8A90A6" />
                    ) : (
                      <GoogleMark />
                    )}
                    <Text className="font-heading text-[13px] text-foreground">
                      Google
                    </Text>
                  </Pressable>
                </View>
              </>
            )}

            <View className="flex-row items-center justify-center">
              <Text className="text-xs text-muted-foreground">
                {isCreatingAccount
                  ? "Already have an account? "
                  : "New to Pyin Nyar? "}
              </Text>
              <Pressable
                accessibilityRole="button"
                hitSlop={8}
                onPress={() => switchMode(!isCreatingAccount)}
              >
                <Text className="font-heading text-xs text-primary">
                  {isCreatingAccount ? "Sign in" : "Create account"}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Trust row — sign-in only */}
          {!isCreatingAccount ? (
            <View className="mt-3 flex-row items-center justify-center gap-1.5">
              <ThemedIcon
                as={ShieldCheck}
                size={12}
                className="text-muted-foreground/70"
              />
              <Text className="text-[10px] text-muted-foreground/80">
                Safe & secure
              </Text>
              <View className="h-1 w-1 rounded-full bg-muted-foreground/50" />
              <Text className="text-[10px] text-muted-foreground/80">
                Friendly tutors
              </Text>
              <View className="h-1 w-1 rounded-full bg-muted-foreground/50" />
              <Text className="text-[10px] text-muted-foreground/80">
                24/7 support
              </Text>
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
