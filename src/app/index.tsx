import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Grid, GridItem } from "@/components/ui/grid";
import { Heading } from "@/components/ui/heading";
import { ThemedIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Link, Redirect, router } from "expo-router";
import { useSession } from "@/hooks/auth";
import {
  BookCheck,
  Brain,
  GraduationCap,
  MessageCircle,
  MessagesCircle,
  Scan,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react-native";
import { ScrollView, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TEACHERS } from "./private/(tabs)/tutor";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Divider } from "@/components/ui/divider";

const FEATURES = [
  {
    icon: Brain,
    title: "AI Tutors",
    description: "ဉာဏ်ရည်တုနည်းပြဆရာ/မများနဲ့ မေးမြန်းဆွေးနွေးပါ",
  },
  {
    icon: Sparkles,
    title: "Personalised",
    description: "ကိုယ့်အဆင့်အတိုင်း သင်ယူနိုင်တဲ့ အတန်းငယ်များ",
  },
  {
    icon: GraduationCap,
    title: "Any Subject",
    description: "သင်္ချာ၊ ရူပဗေဒ၊ ဓာတုဗေဒ၊ အင်္ဂလိပ်စာ အစရှိသည်",
  },
];

export default function WelcomePage() {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const compact = height - insets.top - insets.bottom < 720;
  const { data: user, isLoading } = useSession();

  // Logged-in users should never sit on the marketing page —
  // send them to the app. Wait for the session check first so we
  // don't flash-redirect logged-out users.
  if (!isLoading && user) return <Redirect href="/private/(tabs)" />;

  return (
    <ScrollView className="flex-1 bg-[#f4f7fb]">
      <View
        className={`flex-1 px-4 ${compact ? "gap-3" : "gap-5"}`}
        style={{
          paddingTop: insets.top + (compact ? 4 : 12),
          paddingBottom: insets.bottom + (compact ? 4 : 12),
        }}
      >
        <View className="rounded-[30px] border border-primary/10 bg-card p-4 shadow-sm shadow-primary/5">
          <VStack space={compact ? "sm" : "md"} className="items-center">
            <View className="flex-row items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5">
              <Box
                className={`${compact ? "h-8 w-8 rounded-xl" : "h-10 w-10 rounded-2xl"} bg-primary items-center justify-center shadow-sm shadow-primary/20`}
              >
                <ThemedIcon
                  as={GraduationCap}
                  size={compact ? 18 : 22}
                  className="text-primary-foreground"
                />
              </Box>
              <Text className="font-heading text-primary text-[11px] tracking-[2px] uppercase">
                PYIN NYAR • ပညာ
              </Text>
            </View>

            <VStack space={compact ? "xs" : "sm"} className="items-center">
              <Heading
                size={compact ? "2xl" : "3xl"}
                className="text-foreground text-center font-heading leading-tight"
              >
                Learn at your pace.
              </Heading>
              <Text className="font-body text-base text-muted-foreground text-center leading-relaxed">
                Your personal AI tutor, ready whenever you are.
              </Text>
              <Text
                className="font-body text-sm text-muted-foreground/80 text-center"
                style={{ lineHeight: 26 }}
              >
                မြန်မာကျောင်းသားများအတွက် ကိုယ်ပိုင်AIဆရာ
              </Text>
            </VStack>
          </VStack>

          <View className="mt-4 flex-row items-center justify-between rounded-2xl border border-border/60 bg-primary/5 px-3 py-2">
            <View className="flex-row items-center gap-2">
              <Box className="h-8 w-8 items-center justify-center rounded-full bg-secondary/15">
                <ThemedIcon
                  as={Sparkles}
                  size={16}
                  className="text-secondary"
                />
              </Box>
              <View>
                <Text className="font-heading text-foreground text-[13px]">
                  Study smarter
                </Text>
                <Text className="font-body text-[11px] text-muted-foreground">
                  Personalized learning
                </Text>
              </View>
            </View>
            <Text className="font-heading text-primary text-[12px]">24/7</Text>
          </View>
        </View>

        <Grid className="gap-2" _extra={{ className: "grid-cols-3" }}>
          <GridItem
            className="flex items-center justify-center rounded-[24px] border border-primary/10 bg-primary p-3 shadow-sm shadow-primary/10"
            _extra={{ className: "" }}
          >
            <Box className="h-10 w-10 items-center justify-center rounded-2xl bg-primary-foreground/10">
              <ThemedIcon as={Scan} className="text-secondary" size={18} />
            </Box>
            <Text className="font-heading text-center text-sm mt-2 text-primary-foreground">
              Scan & Solve
            </Text>
            <Text className="text-primary-foreground/80 text-center text-[11px] leading-4">
              Instant math help
            </Text>
          </GridItem>
          <GridItem
            className="flex items-center justify-center rounded-[24px] border border-primary/10 bg-primary/95 p-3 shadow-sm shadow-primary/10"
            _extra={{ className: "" }}
          >
            <Box className="h-10 w-10 items-center justify-center rounded-2xl bg-primary-foreground/10">
              <ThemedIcon
                as={MessagesCircle}
                className="text-secondary"
                size={18}
              />
            </Box>
            <Text className="font-heading text-center text-sm mt-2 text-primary-foreground">
              6 AI teachers
            </Text>
            <Text className="text-primary-foreground/80 text-center text-[11px] leading-4">
              Voice & Chat
            </Text>
          </GridItem>
          <GridItem
            className="flex items-center justify-center rounded-[24px] border border-primary/10 bg-primary/90 p-3 shadow-sm shadow-primary/10"
            _extra={{ className: "" }}
          >
            <Box className="h-10 w-10 items-center justify-center rounded-2xl bg-primary-foreground/10">
              <ThemedIcon as={BookCheck} className="text-secondary" size={18} />
            </Box>
            <Text className="font-heading text-center text-sm mt-2 text-primary-foreground">
              MOE Syllabus
            </Text>
            <Text className="text-primary-foreground/80 text-center text-[11px] leading-4">
              Textbook linked
            </Text>
          </GridItem>
        </Grid>

        <VStack space={compact ? "xs" : "sm"}>
          <Box className="flex-row items-center gap-2 px-1">
            <ThemedIcon as={MessageCircle} size={16} className="text-primary" />
            <View className="flex">
              <Text className="font-heading text-foreground text-lg">
                Why Students Love Us
              </Text>
              <Text className="font text-muted-foreground text-xs leading-loose">
                အဓိက ပါဝင်သော အကျိုးကျေးဇူးများ
              </Text>
            </View>
          </Box>

          <VStack space={compact ? "xs" : "sm"}>
            {FEATURES.map((f) => (
              <Card
                key={f.title}
                size="sm"
                className={`flex-row items-center gap-3 rounded-2xl border border-border/70 bg-card px-3 ${compact ? "py-2" : "py-3"}`}
              >
                <Box
                  className={`${compact ? "h-10 w-10 rounded-xl" : "h-12 w-12 rounded-2xl"} bg-primary/10 items-center justify-center shrink-0`}
                >
                  <ThemedIcon
                    as={f.icon}
                    size={compact ? 18 : 20}
                    className="text-primary"
                  />
                </Box>
                <Box className="flex-1 gap-0.5">
                  <Text className="font-heading text-foreground text-[15px]">
                    {f.title}
                  </Text>
                  <Text
                    className="font-body text-muted-foreground text-[13px]"
                    style={{ lineHeight: compact ? 24 : 26 }}
                  >
                    {f.description}
                  </Text>
                </Box>
              </Card>
            ))}
          </VStack>
        </VStack>

        <View>
          <View className="mb-3 flex flex-row justify-between items-center px-1">
            <View className="flex items-start">
              <Text className="font-heading text-foreground text-base">
                Meet Your AI Teachers
              </Text>
              <Text
                className="font-body text-sm text-muted-foreground/80"
                style={{ lineHeight: 22 }}
              >
                ဘာသာရပ်အလိုက် AI ဆရာ/ဆရာမများ
              </Text>
            </View>
            <Text className="font-heading text-primary text-xs">View all</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {TEACHERS.map((t) => {
              return (
                <Box
                  key={t.id}
                  className="mr-4 flex items-center justify-center rounded-[28px] border border-border bg-card px-5 py-4 shadow-sm shadow-black/5"
                  style={{ width: 148 }}
                >
                  <Avatar
                    size="lg"
                    className="bg-primary border-2 border-primary/20"
                  >
                    <AvatarFallbackText className="text-primary-foreground">
                      {t.name}
                    </AvatarFallbackText>
                    {t.avatar ? <AvatarImage source={t.avatar} /> : null}
                  </Avatar>

                  <Text className="font-heading text-foreground mt-3 text-center text-sm">
                    {t.name}
                  </Text>
                  <Text className="text-xs text-muted-foreground text-center leading-5">
                    {t.subject}
                  </Text>
                </Box>
              );
            })}
          </ScrollView>
        </View>

        <View className="flex rounded-[28px] border border-border bg-primary/2 p-3">
          <View className="flex-row items-center justify-between gap-2">
            <View className="flex items-center flex-1">
              <Heading className="font-heading text-primary text-2xl">
                50,000+
              </Heading>
              <Text className="text-xs text-muted-foreground">Students</Text>
            </View>
            <Divider className="h-full w-0.5 m-0.5" />
            <View className="flex items-center flex-1">
              <Heading className="font-heading text-primary text-2xl">
                1.2M+
              </Heading>
              <Text className="text-xs text-muted-foreground">Questions</Text>
            </View>
            <Divider className="h-full w-0.5 m-0.5" />
            <View className="flex items-center flex-1">
              <Heading className="font-heading text-primary text-2xl">
                94%
              </Heading>
              <Text className="text-xs text-muted-foreground">Success</Text>
            </View>
          </View>
        </View>

        <View>
          <Box className="rounded-[28px] border border-border/70 bg-card p-5 shadow-sm shadow-black/5">
            <View className="mb-3 flex flex-row items-center justify-between gap-2">
              <View className="flex flex-row gap-1">
                <ThemedIcon as={Star} className="text-secondary" />
                <ThemedIcon as={Star} className="text-secondary" />
                <ThemedIcon as={Star} className="text-secondary" />
                <ThemedIcon as={Star} className="text-secondary" />
                <ThemedIcon as={Star} className="text-secondary" />
              </View>
              <Text className="font-heading text-foreground">5.0/5.0</Text>
            </View>
            <VStack className="mb-4">
              <Text size="sm" className="text-foreground/90">
                “Saya Maung explained quadratic equations in Burmese so clearly!
                My math score jumped from 45 to 82 in just 3 weeks.”
              </Text>
            </VStack>
            <Divider className="w-full mb-4" />
            <Box className="flex-row items-center">
              <Avatar className="mr-3 border border-primary/20">
                <AvatarFallbackText>MN</AvatarFallbackText>
                <AvatarImage
                  source={{
                    uri: "https://storage.googleapis.com/banani-avatars/avatar/female/13-17/Southeast%20Asian/6",
                  }}
                  alt="image"
                />
              </Avatar>
              <VStack>
                <Heading size="sm" className="mb-1">
                  Ma Nilar
                </Heading>
                <Text size="sm">Grade 12 • BEHS No. 2 Dagon</Text>
              </VStack>
            </Box>
          </Box>
        </View>

        <VStack space="xs" className="items-center mt-4">
          <Button
            size="lg"
            className="w-full rounded-2xl py-4 shadow-md shadow-primary/25"
            onPress={() => router.push("/login?page=sign-up")}
          >
            <ButtonIcon as={Sparkles} />
            <ButtonText className="font-heading">Get Started</ButtonText>
          </Button>

          <Link href="/login" asChild>
            <Button variant="link" size="sm" className="py-1">
              <ButtonText className="font-body text-muted-foreground">
                Already have an account?{" "}
                <Text className="font-heading text-primary">Sign in</Text>
              </ButtonText>
            </Button>
          </Link>

          <Box className="flex-row items-center gap-1.5 rounded-full bg-card px-3 py-1.5 shadow-sm shadow-black/5">
            <ThemedIcon
              as={ShieldCheck}
              size={14}
              className="text-muted-foreground/70"
            />
            <Text className="font-body text-xs text-muted-foreground/70">
              A safe space to ask, explore, and grow
            </Text>
          </Box>
        </VStack>
      </View>
    </ScrollView>
  );
}
