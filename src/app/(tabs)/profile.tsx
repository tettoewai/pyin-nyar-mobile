import { SubjectTaskCard } from "@/components/subject-task-card";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Grid, GridItem } from "@/components/ui/grid";
import { Heading } from "@/components/ui/heading";
import { ThemedIcon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { router } from "expo-router";
import {
  Bell,
  BookOpen,
  ChevronRight,
  Flame,
  Gem,
  HelpCircle,
  Languages,
  Lock,
  LogOut,
  Pen,
  Settings,
  Share2,
  ShieldCheck,
  Star,
  Target,
  Trophy,
  User,
  Zap,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, RefreshControl, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SectionHeader } from ".";
import { subjectTasks } from "./practice";

const weekProgress = [
  { day: "MON", point: 20 },
  { day: "TUE", point: 45 },
  { day: "WED", point: 56 },
  { day: "THU", point: 24 },
  { day: "FRI", point: 45 },
  { day: "SAT", point: 37 },
  { day: "SUN", point: 28 },
];

const BADGES = [
  {
    id: "streak-10",
    name: "10-Day Streak",
    icon: Flame,
    tile: "bg-orange-100 dark:bg-orange-950",
    iconColor: "text-orange-600 dark:text-orange-300",
    earned: true,
  },
  {
    id: "top-class",
    name: "Top of Class",
    icon: Trophy,
    tile: "bg-violet-100 dark:bg-violet-950",
    iconColor: "text-violet-600 dark:text-violet-300",
    earned: true,
  },
  {
    id: "speed-star",
    name: "Speed Star",
    icon: Zap,
    tile: "bg-blue-100 dark:bg-blue-950",
    iconColor: "text-blue-600 dark:text-blue-300",
    earned: true,
  },
  {
    id: "perfect-10",
    name: "Perfect 10",
    icon: Star,
    tile: "bg-emerald-100 dark:bg-emerald-950",
    iconColor: "text-emerald-600 dark:text-emerald-300",
    earned: false,
  },
  {
    id: "bookworm",
    name: "Bookworm",
    icon: BookOpen,
    tile: "bg-rose-100 dark:bg-rose-950",
    iconColor: "text-rose-600 dark:text-rose-300",
    earned: false,
  },
  {
    id: "sharp-aim",
    name: "Sharp Aim",
    icon: Target,
    tile: "bg-cyan-100 dark:bg-cyan-950",
    iconColor: "text-cyan-600 dark:text-cyan-300",
    earned: false,
  },
];

export default function Profile() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const { maxPoint, totalPoints, todayIndex } = useMemo(() => {
    const max = Math.max(...weekProgress.map((d) => d.point), 1);
    const total = weekProgress.reduce((sum, d) => sum + d.point, 0);
    // Monday-start week: JS getDay() is 0=SUN … 6=SAT
    const today = (new Date().getDay() + 6) % 7;
    return { maxPoint: max, totalPoints: total, todayIndex: today };
  }, []);

  const earnedCount = BADGES.filter((b) => b.earned).length;
  const badgeProgress =
    BADGES.length > 0 ? Math.round((earnedCount / BADGES.length) * 100) : 0;

  return (
    <View
      className="flex-1 bg-pg-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <ScrollView
        className="flex-1 bg-pg-background"
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, 16) + 96,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              setTimeout(() => setRefreshing(false), 900);
            }}
          />
        }
      >
        <View className="bg-primary flex items-center justify-center py-10">
          <View className="w-full flex flex-row p-4 justify-between absolute top-0">
            <Button
              size="icon"
              accessibilityLabel="Share profile"
              className="bg-primary-foreground/20 rounded-full"
            >
              <ButtonIcon as={Share2} className="text-primary-foreground" />
            </Button>
            <Button
              size="icon"
              accessibilityLabel="Profile settings"
              className="bg-primary-foreground/20 rounded-full"
            >
              <ButtonIcon as={Settings} className="text-primary-foreground" />
            </Button>
          </View>
          <View className="size-24 rounded-full items-center flex justify-center border-4 border-secondary">
            <Image
              size="xl"
              source={{
                uri: "https://storage.googleapis.com/banani-avatars/avatar/female/13-17/Southeast Asian/8",
              }}
              alt="Ma Thiri Kyaw profile"
              className="object-fill size-full rounded-full"
            />
            <Button
              size="icon"
              accessibilityLabel="Edit profile photo"
              className="absolute bottom-0 right-0 bg-secondary rounded-full z-10 border-2 border-white w-8 h-8"
            >
              <ButtonIcon as={Pen} />
            </Button>
          </View>
          <View className="mt-4 flex items-center justify-center">
            <Text className="font-heading text-xl text-primary-foreground text-center">
              Ma Thiri Kyaw
            </Text>
            <Text className="font-body text-primary-foreground/70 text-center">
              Grade 12 • Yangon Division
            </Text>
          </View>
        </View>

        <View className="px-4">
          <Grid className="gap-2 mt-4" _extra={{ className: "grid-cols-4" }}>
            <GridItem
              className="bg-card border border-border p-3 flex items-center justify-center rounded-3xl gap-2"
              _extra={{ className: "" }}
            >
              <ThemedIcon as={Zap} size={25} className="text-secondary" />
              <Text className="font-heading text-center text-[15px]">2,840</Text>
              <Text className="font-body text-center text-[11px] text-muted-foreground">XP</Text>
            </GridItem>
            <GridItem
              className="bg-card border border-border p-3 flex items-center justify-center rounded-3xl gap-2"
              _extra={{ className: "" }}
            >
              <ThemedIcon as={Flame} size={25} className="text-red-500" />
              <Text className="font-heading text-center text-[15px]">12</Text>
              <Text className="font-body text-center text-[11px] text-muted-foreground">Streak</Text>
            </GridItem>
            <GridItem
              className="bg-card border border-border p-3 flex items-center justify-center rounded-3xl gap-2"
              _extra={{ className: "" }}
            >
              <ThemedIcon as={Trophy} size={25} className="text-primary" />
              <Text className="font-heading text-center text-[15px]">#14</Text>
              <Text className="font-body text-center text-[11px] text-muted-foreground">Rank</Text>
            </GridItem>
            <GridItem
              className="bg-card border border-border p-3 flex items-center justify-center rounded-3xl gap-2"
              _extra={{ className: "" }}
            >
              <ThemedIcon as={Gem} size={25} className="text-blue-500" />
              <Text className="font-heading text-center text-[15px]">240</Text>
              <Text className="font-body text-center text-[11px] text-muted-foreground">Gems</Text>
            </GridItem>
          </Grid>

          <View className="mt-4 bg-card rounded-3xl p-4 border border-border">
            <View className="flex flex-row items-center justify-between">
              <Text className="font-heading text-[17px]">This Week</Text>
              <Text className="text-primary font-heading text-[13px]">
                {totalPoints} min total
              </Text>
            </View>

            <View
              className="flex-row gap-2 mt-4 h-48"
              accessibilityRole="image"
              accessibilityLabel={`Study minutes this week, total ${totalPoints} minutes`}
            >
              {weekProgress.map((item, index) => {
                const heightPct =
                  maxPoint > 0 ? (item.point / maxPoint) * 100 : 0;
                const isToday = index === todayIndex;
                const isMax = item.point === maxPoint;
                return (
                  <View
                    key={item.day}
                    className="flex-1 items-center justify-end gap-1.5 h-full"
                    accessible
                    accessibilityLabel={`${item.day}: ${item.point} minutes${isToday ? ", today" : ""}`}
                  >
                    <Text
                      className={`text-[11px] font-heading ${
                        isToday || isMax
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.point}
                    </Text>
                    <View className="bg-muted h-32 w-full rounded-full flex items-end justify-end overflow-hidden">
                      <View
                        style={{
                          height: `${Math.max(heightPct, 8)}%`,
                          minHeight: 8,
                        }}
                        className={`w-full rounded-full ${
                          isToday
                            ? "bg-primary"
                            : isMax
                              ? "bg-primary/80"
                              : "bg-primary/30"
                        }`}
                      />
                    </View>
                    <Text
                      className={`font-heading text-[11px] ${
                        isToday ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {item.day}
                    </Text>
                    <View
                      className={`h-1.5 w-1.5 rounded-full ${
                        isToday ? "bg-primary" : "bg-transparent"
                      }`}
                    />
                  </View>
                );
              })}
            </View>
            <Box className="flex-row border-t border-border mt-4 pt-3">
              <VStack className="items-center flex-1 border-r border-border/70">
                <Heading size="md">53</Heading>
                <Text className="font-body text-[13px] text-muted-foreground">Lessons</Text>
              </VStack>
              <VStack className="items-center flex-1 border-r border-border/70">
                <Heading size="md">8</Heading>
                <Text className="font-body text-[13px] text-muted-foreground">Tests</Text>
              </VStack>
              <VStack className="items-center flex-1">
                <Heading size="md">91%</Heading>
                <Text className="font-body text-[13px] text-muted-foreground">Accuracy</Text>
              </VStack>
            </Box>
          </View>

          <Box className="mt-4 bg-card rounded-3xl border border-border">
            <View className="px-4 pt-4 pb-1">
              <SectionHeader
                title="Matric Readiness • ပြင်ဆင်မှု"
                action="Details"
                onAction={() => router.push("/(tabs)/practice")}
              />
            </View>
            {subjectTasks.map((item, index) => (
              <View
                key={item.id}
                className={
                  index < subjectTasks.length - 1
                    ? "border-b border-border/60"
                    : undefined
                }
              >
                <SubjectTaskCard
                  task={item}
                  variant="mini"
                  onPress={() => router.push("/(tabs)/practice")}
                />
              </View>
            ))}
          </Box>

          <Box className="mt-4 bg-card rounded-3xl border border-border p-4">
            <View className="flex-row items-center justify-between">
              <Text className="font-heading text-[17px] leading-loose">
                Badges • ဆုများ
              </Text>
              <View className="bg-muted rounded-full px-2.5 py-1">
                <Text className="font-heading text-[12px] text-muted-foreground">
                  {earnedCount}/{BADGES.length} earned
                </Text>
              </View>
            </View>

            <View className="mt-3">
              <Progress
                value={badgeProgress}
                orientation="horizontal"
                accessibilityLabel={`Badges progress ${badgeProgress} percent`}
              >
                <ProgressFilledTrack />
              </Progress>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="flex-row gap-1 py-1 mt-2"
              className="w-full"
            >
              {BADGES.map((badge) => (
                <Pressable
                  key={badge.id}
                  accessibilityRole="button"
                  accessibilityLabel={`${badge.name} badge, ${badge.earned ? "earned" : "locked"}`}
                  className="w-[76px] items-center gap-1.5 py-1 active:opacity-70"
                >
                  <View
                    className={`size-16 rounded-full items-center justify-center relative ${
                      badge.earned ? badge.tile : "bg-muted"
                    }`}
                  >
                    <ThemedIcon
                      as={badge.icon}
                      size={26}
                      className={
                        badge.earned
                          ? badge.iconColor
                          : "text-muted-foreground/50"
                      }
                    />
                    {!badge.earned && (
                      <View className="absolute -bottom-0.5 -right-0.5 size-6 rounded-full bg-card border border-border items-center justify-center">
                        <ThemedIcon
                          as={Lock}
                          size={12}
                          className="text-muted-foreground"
                        />
                      </View>
                    )}
                  </View>
                  <Text
                    numberOfLines={2}
                    className={`h-8 text-center text-[12px] leading-4 ${
                      badge.earned
                        ? "font-heading text-foreground"
                        : "font-body text-muted-foreground"
                    }`}
                  >
                    {badge.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </Box>

          <Box className="rounded-3xl bg-card py-2 mt-4 border border-border">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Edit profile"
              className="flex-row items-center justify-between px-4 py-3 active:opacity-70 border-b border-border/60"
            >
              <View className="flex-row gap-3 items-center flex-1 min-w-0">
                <View className="size-10 rounded-2xl bg-muted items-center justify-center shrink-0">
                  <ThemedIcon as={User} size={19} className="text-foreground" />
                </View>
                <View className="flex-1 min-w-0">
                  <Text className="font-heading text-[15px]">Edit Profile</Text>
                  <Text
                    className="font-body text-[13px] text-muted-foreground leading-loose"
                    numberOfLines={1}
                  >
                    ပရိုဖိုင်ပြင်မည်
                  </Text>
                </View>
              </View>
              <ThemedIcon
                as={ChevronRight}
                size={18}
                className="text-muted-foreground"
              />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              className="flex-row items-center justify-between px-4 py-3 active:opacity-70 border-b border-border/60"
            >
              <View className="flex-row gap-3 items-center flex-1 min-w-0">
                <View className="size-10 rounded-2xl bg-muted items-center justify-center shrink-0">
                  <ThemedIcon as={Bell} size={19} className="text-foreground" />
                </View>
                <View className="flex-1 min-w-0">
                  <Text className="font-heading text-[15px]">Notification</Text>
                  <Text
                    className="font-body text-[13px] text-muted-foreground leading-loose"
                    numberOfLines={1}
                  >
                    သတိပေးချက်
                  </Text>
                </View>
              </View>
              <ThemedIcon
                as={ChevronRight}
                size={18}
                className="text-muted-foreground"
              />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Language, currently Myanmar and English"
              className="flex-row items-center justify-between px-4 py-3 active:opacity-70 border-b border-border/60"
            >
              <View className="flex-row gap-3 items-center flex-1 min-w-0">
                <View className="size-10 rounded-2xl bg-muted items-center justify-center shrink-0">
                  <ThemedIcon
                    as={Languages}
                    size={19}
                    className="text-foreground"
                  />
                </View>
                <View className="flex-1 min-w-0">
                  <Text className="font-heading text-[15px]">Language</Text>
                  <Text
                    className="font-body text-[13px] text-muted-foreground leading-loose"
                    numberOfLines={1}
                  >
                    ဘာသာစကား
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center gap-1 shrink-0">
                <Text className="text-muted-foreground font-heading text-[13px] leading-loose">
                  မြန်မာ + EN
                </Text>
                <ThemedIcon
                  as={ChevronRight}
                  size={18}
                  className="text-muted-foreground"
                />
              </View>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Privacy"
              className="flex-row items-center justify-between px-4 py-3 active:opacity-70 border-b border-border/60"
            >
              <View className="flex-row gap-3 items-center flex-1 min-w-0">
                <View className="size-10 rounded-2xl bg-muted items-center justify-center shrink-0">
                  <ThemedIcon
                    as={ShieldCheck}
                    size={19}
                    className="text-foreground"
                  />
                </View>
                <View className="flex-1 min-w-0">
                  <Text className="font-heading text-[15px]">Privacy</Text>
                  <Text
                    className="font-body text-[13px] text-muted-foreground leading-loose"
                    numberOfLines={1}
                  >
                    ကိုယ်ရေးလုံခြုံမှု
                  </Text>
                </View>
              </View>
              <ThemedIcon
                as={ChevronRight}
                size={18}
                className="text-muted-foreground"
              />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Help and support"
              className="flex-row items-center justify-between px-4 py-3 active:opacity-70 border-b border-border/60"
            >
              <View className="flex-row gap-3 items-center flex-1 min-w-0">
                <View className="size-10 rounded-2xl bg-muted items-center justify-center shrink-0">
                  <ThemedIcon
                    as={HelpCircle}
                    size={19}
                    className="text-foreground"
                  />
                </View>
                <View className="flex-1 min-w-0">
                  <Text className="font-heading text-[15px]">
                    Help & Support
                  </Text>
                  <Text
                    className="font-body text-[13px] text-muted-foreground leading-loose"
                    numberOfLines={1}
                  >
                    အကူအညီ
                  </Text>
                </View>
              </View>
              <ThemedIcon
                as={ChevronRight}
                size={18}
                className="text-muted-foreground"
              />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Sign out"
              className="flex-row items-center justify-between px-4 py-3 active:opacity-70"
            >
              <View className="flex-row gap-3 items-center flex-1 min-w-0">
                <View className="size-10 rounded-2xl bg-destructive/10 items-center justify-center shrink-0">
                  <ThemedIcon
                    as={LogOut}
                    size={19}
                    className="text-destructive"
                  />
                </View>
                <View className="flex-1 min-w-0">
                  <Text className="font-heading text-[15px] text-destructive">
                    Sign Out
                  </Text>
                  <Text
                    className="font-body text-[13px] text-muted-foreground leading-loose"
                    numberOfLines={1}
                  >
                    ထွက်မည်
                  </Text>
                </View>
              </View>
            </Pressable>
          </Box>
        </View>
      </ScrollView>
    </View>
  );
}
