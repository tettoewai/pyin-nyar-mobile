import "@/global.css";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { queryClient, useSession } from "@/hooks/auth";
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/nunito";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "Nunito-Regular": Nunito_400Regular,
    "Nunito-SemiBold": Nunito_600SemiBold,
    "Nunito-Bold": Nunito_700Bold,
    "Nunito-ExtraBold": Nunito_800ExtraBold,
  });
  const fontsReady = fontsLoaded || !!fontError;

  const colorScheme = useColorScheme() ?? "light";

  useEffect(() => {
    if (fontError) {
      console.warn("Nunito fonts failed to load, using system fonts", fontError);
    }
  }, [fontError]);

  // Safety net: never let the splash hang indefinitely in Expo Go.
  useEffect(() => {
    const t = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
    }, 5000);
    return () => clearTimeout(t);
  }, []);

  if (!fontsReady) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider mode="system">
        <SafeAreaProvider>
          <StatusBar
            style={colorScheme === "dark" ? "light" : "dark"}
          />
          <Nav />
        </SafeAreaProvider>
      </GluestackUIProvider>
    </QueryClientProvider>
  );
}

function Nav() {
  const { data: user, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading) SplashScreen.hideAsync();
  }, [isLoading]);

  if (isLoading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Protected guard={!user}>
        <Stack.Screen name="login" />
      </Stack.Protected>
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="private" />
      </Stack.Protected>
    </Stack>
  );
}
