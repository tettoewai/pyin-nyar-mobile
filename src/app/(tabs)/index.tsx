import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarGroup,
} from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Grid, GridItem } from "@/components/ui/grid";
import { ThemedIcon } from "@/components/ui/icon";
import { LinkText } from "@/components/ui/link";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { Text } from "@/components/ui/text";

import { Link, router } from "expo-router";
import {
  Activity,
  ArrowRight,
  Atom,
  Bell,
  BookOpen,
  Calculator,
  CaseSensitive,
  CircleCheck,
  Clock3,
  Flame,
  FlaskConical,
  Gem,
  Languages,
  Play,
  SendHorizontal,
  Sparkles,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TEACHER_AVATAR =
  "https://storage.googleapis.com/banani-generated-images/generated-images/25d56666-863f-48f1-8118-82fb9938006f.jpg";

const SUBJECTS = [
  {
    title: "သင်္ချာ",
    titleEn: "Maths",
    icon: Calculator,
    lessons: 42,
    tile: "bg-blue-200 dark:bg-blue-950",
    iconColor: "text-blue-700 dark:text-blue-300",
  },
  {
    title: "ရူပဗေဒ",
    titleEn: "Physics",
    icon: Atom,
    lessons: 28,
    tile: "bg-purple-200 dark:bg-purple-950",
    iconColor: "text-purple-700 dark:text-purple-300",
  },
  {
    title: "ဓာတု",
    titleEn: "Chemistry",
    icon: FlaskConical,
    lessons: 31,
    tile: "bg-emerald-200 dark:bg-emerald-950",
    iconColor: "text-emerald-700 dark:text-emerald-300",
  },
  {
    title: "အင်္ဂလိပ်",
    titleEn: "English",
    icon: CaseSensitive,
    lessons: 56,
    tile: "bg-amber-200 dark:bg-amber-950",
    iconColor: "text-amber-700 dark:text-amber-300",
  },
  {
    title: "ဇီဝ",
    titleEn: "Biology",
    icon: Activity,
    lessons: 19,
    tile: "bg-rose-200 dark:bg-rose-950",
    iconColor: "text-rose-700 dark:text-rose-300",
  },
  {
    title: "မြန်မာ",
    titleEn: "Myanmar",
    icon: BookOpen,
    lessons: 24,
    tile: "bg-indigo-200 dark:bg-indigo-950",
    iconColor: "text-indigo-700 dark:text-indigo-300",
  },
];

const PRACTICE_ITEMS = [
  {
    id: "maths-fix",
    icon: Calculator,
    tile: "bg-primary",
    iconColor: "text-primary-foreground",
    title: "5 Maths problems fixed for you",
    subtitle: "Based on yesterday's mistakes",
    meta: "10 min",
    tag: "For you",
  },
  {
    id: "english-voice",
    icon: Languages,
    tile: "bg-accent",
    iconColor: "text-accent-foreground",
    title: "English speaking: Market dialogue",
    subtitle: "Practice with voice",
    meta: "15 min",
    tag: "Speaking",
  },
];

const SUGGESTIONS = [
  "မင်္ဂလာပါ ဆရာမ",
  "ဒီနေ့ ဘာသင်မှာလဲ?",
  "What is Newton's 2nd law",
];

const GROUP_AVATARS = [
  { initials: "AK", color: "bg-emerald-600" },
  { initials: "RS", color: "bg-cyan-600" },
  { initials: "TM", color: "bg-indigo-600" },
];

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

/** Days until the next March 1 (Matric exam season). */
function examDaysLeft(from = new Date()): number {
  const year = from.getFullYear();
  const march =
    from.getMonth() < 2 || (from.getMonth() === 2 && from.getDate() <= 1)
      ? new Date(year, 2, 1)
      : new Date(year + 1, 2, 1);
  return Math.max(
    0,
    Math.ceil((march.getTime() - from.getTime()) / 86_400_000),
  );
}

function SectionHeader({
  title,
  action,
  onAction,
}: {
  title: string;
  action: string;
  onAction?: () => void;
}) {
  return (
    <Box className="w-full flex justify-between items-center flex-row">
      <Text className="font-heading text-[17px] text-foreground">{title}</Text>
      <Pressable
        onPress={onAction}
        accessibilityRole="button"
        accessibilityLabel={action}
        className="px-2 py-1 rounded-full active:opacity-70"
      >
        <LinkText className="font-bold">{action}</LinkText>
      </Pressable>
    </Box>
  );
}

export default function Index() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const daysLeft = useMemo(() => examDaysLeft(), []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="px-4"
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, 16) + 96,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* ── Greeting ─────────────────────────────────────── */}
        <View className="w-full pt-2 pb-1 flex flex-row justify-between items-center">
          <View className="flex flex-row items-center flex-1 min-w-0">
            <Avatar size="md" className="bg-primary">
              <AvatarFallbackText className="text-primary-foreground font-bold">
                Th
              </AvatarFallbackText>
            </Avatar>
            <View className="ml-2.5 flex-1 min-w-0">
              <Text
                size="md"
                numberOfLines={1}
                className="font-heading text-foreground"
              >
                {greeting()}, Thiri! 👋
              </Text>
              <Text
                numberOfLines={1}
                className="font-body text-muted-foreground text-[13px]"
              >
                Grade 12 • Yangon
              </Text>
            </View>
          </View>
          <View className="flex flex-row gap-1.5 items-center shrink-0">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="12 day streak"
              className="flex-row items-center gap-1 rounded-full border border-border bg-card px-3 py-2 active:opacity-70"
            >
              <ThemedIcon as={Flame} size={15} className="text-red-500" />
              <Text className="font-heading text-[13px] text-foreground">
                12
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="240 gems"
              className="flex-row items-center gap-1 rounded-full border border-border bg-card px-3 py-2 active:opacity-70"
            >
              <ThemedIcon as={Gem} size={15} className="text-blue-500" />
              <Text className="font-heading text-[13px] text-foreground">
                240
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Notifications, 2 unread"
              className="relative w-10 h-10 rounded-full border border-border bg-card items-center justify-center active:opacity-70"
            >
              <ThemedIcon
                as={Bell}
                size={17}
                className="text-muted-foreground"
              />
              <View className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-destructive border border-card" />
            </Pressable>
          </View>
        </View>

        {/* ── AI teacher hero ──────────────────────────────── */}
        <Card
          className="rounded-3xl bg-primary overflow-hidden mt-3 border-0"
          style={{ elevation: 3 }}
        >
          <View className="flex-row w-full items-center">
            <View className="relative mr-3.5 shrink-0">
              <Image
                source={{ uri: TEACHER_AVATAR }}
                className="w-[72px] h-[72px] rounded-full border-2 border-primary-foreground/40"
                accessibilityLabel="Sayarma May Thu avatar"
              />
              <AvatarBadge className="size-4 border-primary" />
            </View>
            <Box className="flex flex-col justify-center items-start flex-1 min-w-0">
              <View className="flex-row items-center gap-1.5">
                <Text
                  size="md"
                  className="font-heading text-primary-foreground"
                >
                  Sayarma May Thu
                </Text>
                <ThemedIcon
                  as={Sparkles}
                  size={14}
                  className="text-primary-foreground"
                />
              </View>
              <Text size="sm" className="font-body text-primary-foreground/90">
                Your AI teacher • Online
              </Text>
              <Text
                numberOfLines={1}
                className="font-body text-[13px] text-primary-foreground/80"
              >
                Ask me anything, anytime
              </Text>
            </Box>
          </View>

          <Link href="/tutor/saya_maung" asChild>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ask your AI teacher anything"
              className="w-full rounded-full bg-card flex flex-row mt-3.5 p-1.5 pl-4 items-center justify-between active:opacity-90"
            >
              <Text className="font-body text-[14px] text-muted-foreground flex-1">
                Ask anything…
              </Text>
              <View className="rounded-full p-3 bg-primary">
                <ThemedIcon
                  as={SendHorizontal}
                  size={17}
                  className="text-primary-foreground"
                />
              </View>
            </Pressable>
          </Link>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="flex-row items-center gap-2 pr-2 py-0.5"
            className="w-full mt-2.5"
          >
            {SUGGESTIONS.map((s) => (
              <Pressable
                key={s}
                onPress={() => router.push("/tutor/saya_maung")}
                accessibilityRole="button"
                accessibilityLabel={`Ask: ${s}`}
                className="shrink-0 bg-primary-foreground/10 border border-primary-foreground/25 px-3.5 py-2 rounded-full active:opacity-80"
              >
                <Text className="text-primary-foreground text-[13px] font-body">
                  {s}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* decorative glows */}
          <View
            pointerEvents="none"
            className="bg-white/10 absolute -top-20 -right-16 rounded-full w-60 h-60"
          />
          <View
            pointerEvents="none"
            className="bg-black/10 absolute -bottom-24 left-16 rounded-full w-40 h-40"
          />
        </Card>

        {/* ── Continue learning ────────────────────────────── */}
        <Pressable
          onPress={() => router.push("/(tabs)/practice")}
          accessibilityRole="button"
          accessibilityLabel="Resume Quadratic Equations chapter 3, 68 percent complete"
          className="bg-card border border-border rounded-2xl w-full mt-3 p-4 active:opacity-90"
          style={{ elevation: 1 }}
        >
          <Box className="flex items-center justify-between flex-row w-full">
            <Box className="flex flex-row gap-3 items-center flex-1 min-w-0">
              <Box className="flex items-center justify-center bg-primary w-10 h-10 rounded-xl shrink-0">
                <ThemedIcon
                  as={Play}
                  size={17}
                  className="text-primary-foreground"
                />
              </Box>
              <Box className="flex-1 min-w-0">
                <Text className="text-primary font-body font-bold text-[11px] tracking-widest">
                  CONTINUE • GRADE 12 MATHS
                </Text>
                <Text
                  numberOfLines={1}
                  className="font-heading text-[15px] text-foreground mt-0.5"
                >
                  Quadratic Equations — Ch. 3
                </Text>
              </Box>
            </Box>
            <Text className="text-primary font-heading text-xl ml-2">68%</Text>
          </Box>
          <Box className="mt-3">
            <Progress
              value={68}
              orientation="horizontal"
              accessibilityLabel="Course progress 68 percent"
            >
              <ProgressFilledTrack />
            </Progress>
          </Box>
          <Box className="flex flex-row justify-between items-center mt-3">
            <View className="flex-row items-center gap-1.5">
              <ThemedIcon
                as={Clock3}
                size={13}
                className="text-muted-foreground"
              />
              <Text className="font-body text-[13px] text-muted-foreground">
                Lesson 8 of 12 • 15 min left
              </Text>
            </View>
            <Button className="bg-primary rounded-full" size="sm">
              <ButtonText>Resume</ButtonText>
              <ButtonIcon as={ArrowRight} />
            </Button>
          </Box>
        </Pressable>

        {/* ── Exam countdown ───────────────────────────────── */}
        <View
          className="bg-secondary rounded-2xl px-4 py-3.5 flex items-center flex-row justify-between mt-3 w-full"
          style={{ elevation: 1 }}
        >
          <View className="flex-row items-center gap-3 flex-1 min-w-0">
            <Box className="w-14 h-14 bg-card rounded-2xl flex items-center justify-center shrink-0">
              <Text className="font-heading text-lg text-foreground">
                {daysLeft}
              </Text>
            </Box>
            <Box className="flex-1 min-w-0">
              <Text
                numberOfLines={1}
                className="font-heading text-[15px] text-secondary-foreground"
              >
                Matric Exam • {daysLeft} days left
              </Text>
              <Text
                numberOfLines={2}
                className="font-body text-[13px] mt-0.5 text-secondary-foreground/80"
              >
                Daily mock test ready — 20 questions
              </Text>
            </Box>
          </View>
          <Button
            onPress={() => router.push("/(tabs)/practice")}
            className="bg-card rounded-full ml-2"
            size="sm"
          >
            <ButtonText className="text-card-foreground font-heading">
              Start
            </ButtonText>
          </Button>
        </View>

        {/* ── Today's practice ─────────────────────────────── */}
        <View className="mt-5 w-full">
          <SectionHeader
            title="Today's practice • လေ့ကျင့်ခန်း"
            action="History"
            onAction={() => router.push("/(tabs)/practice")}
          />
          <Box className="flex-col gap-2.5 mt-2.5">
            {PRACTICE_ITEMS.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => router.push("/(tabs)/practice")}
                accessibilityRole="button"
                accessibilityLabel={`${item.title}, ${item.meta}`}
                className="w-full bg-card rounded-2xl p-3.5 flex flex-row justify-between items-center border border-border active:opacity-90"
                style={{ elevation: 1 }}
              >
                <Box
                  className={`${item.tile} w-[52px] h-[52px] rounded-2xl flex items-center justify-center shrink-0`}
                >
                  <ThemedIcon
                    as={item.icon}
                    size={22}
                    className={item.iconColor}
                  />
                </Box>
                <Box className="flex-1 min-w-0 mx-3">
                  <Box className="self-start bg-muted rounded-full px-2 py-0.5 mb-1">
                    <Text className="font-body font-bold text-[10px] text-muted-foreground tracking-wide">
                      {item.tag.toUpperCase()}
                    </Text>
                  </Box>
                  <Text
                    numberOfLines={2}
                    className="font-heading text-[14.5px] text-foreground leading-snug"
                  >
                    {item.title}
                  </Text>
                  <Text
                    numberOfLines={1}
                    className="font-body text-[12.5px] text-muted-foreground mt-0.5"
                  >
                    {item.subtitle} • {item.meta}
                  </Text>
                </Box>
                <View className="w-10 h-10 rounded-full bg-primary items-center justify-center shrink-0">
                  <ThemedIcon
                    as={ArrowRight}
                    size={17}
                    className="text-primary-foreground"
                  />
                </View>
              </Pressable>
            ))}
          </Box>
        </View>

        {/* ── Subjects ─────────────────────────────────────── */}
        <Box className="mt-5 w-full">
          <SectionHeader
            title="Subjects • ဘာသာရပ်များ"
            action="See all"
            onAction={() => router.push("/(tabs)/practice")}
          />
          <View className="w-full mt-2.5">
            <Grid className="gap-2.5" _extra={{ className: "grid-cols-3" }}>
              {SUBJECTS.map((item) => (
                <GridItem
                  key={item.titleEn}
                  className="bg-card border border-border rounded-2xl p-3"
                  _extra={{ className: "" }}
                >
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`${item.title} ${item.titleEn}, ${item.lessons} lessons`}
                    onPress={() => router.push("/(tabs)/practice")}
                    className="active:opacity-80"
                  >
                    <Box
                      className={`${item.tile} w-[52px] h-[52px] rounded-xl flex items-center justify-center mb-2`}
                    >
                      <ThemedIcon
                        as={item.icon}
                        size={22}
                        className={item.iconColor}
                      />
                    </Box>
                    <Text className="font-heading text-[15px] text-foreground">
                      {item.title}
                    </Text>
                    <Text className="font-body text-[12px] text-muted-foreground">
                      {item.titleEn}
                    </Text>
                    <Box className="self-start bg-muted rounded-full px-2 py-0.5 mt-2">
                      <Text className="font-body font-bold text-[11px] text-muted-foreground">
                        {item.lessons} lessons
                      </Text>
                    </Box>
                  </Pressable>
                </GridItem>
              ))}
            </Grid>
          </View>

          {/* Social proof */}
          <View
            className="bg-card border border-border rounded-2xl flex flex-row p-4 justify-between items-center mt-3"
            style={{ elevation: 1 }}
          >
            <AvatarGroup>
              {GROUP_AVATARS.map((avatar) => (
                <Avatar
                  size="sm"
                  key={avatar.initials}
                  className={`border-2 border-card ${avatar.color}`}
                >
                  <AvatarFallbackText className="text-white font-bold">
                    {avatar.initials}
                  </AvatarFallbackText>
                </Avatar>
              ))}
            </AvatarGroup>
            <Text className="flex-1 mx-3 text-[13px] font-body text-muted-foreground">
              <Text className="font-heading text-foreground">2,400+</Text>{" "}
              students from Yangon & Mandalay studied today
            </Text>
            <Pressable
              onPress={() => router.push("/(tabs)/tutor")}
              accessibilityRole="button"
              accessibilityLabel="Join study chat"
              className="px-3 py-2 rounded-full active:opacity-70"
            >
              <Text className="text-primary font-heading text-[14px]">
                Join
              </Text>
            </Pressable>
          </View>
        </Box>

        {/* ── Footer ───────────────────────────────────────── */}
        <Box className="w-full flex-row justify-center items-center mt-8 gap-1.5">
          <ThemedIcon
            as={CircleCheck}
            size={15}
            className="text-muted-foreground"
          />
          <Text className="font-body text-[13px] text-muted-foreground">
            You&apos;re all caught up — keep the streak going! 🔥
          </Text>
        </Box>
      </ScrollView>
    </View>
  );
}
