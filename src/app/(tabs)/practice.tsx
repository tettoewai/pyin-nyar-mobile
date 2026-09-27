import {
  RecentResultCard,
  type RecentResult,
} from "@/components/recent-result-card";
import {
  SubjectTaskCard,
  type SubjectTask,
} from "@/components/subject-task-card";
import { SUBJECT_META } from "@/components/subjects";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Grid, GridItem } from "@/components/ui/grid";
import { ThemedIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import {
  Bell,
  CircleCheck,
  RefreshCcw,
  Timer,
  Zap,
} from "lucide-react-native";
import { useRef, useState } from "react";
import { Pressable, RefreshControl, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SectionHeader } from ".";

export default function Tutor() {
  const insets = useSafeAreaInsets();
  const searchRef = useRef<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const subjectTasks: SubjectTask[] = [
    {
      ...SUBJECT_META.maths,
      title: "သင်္ချာ",
      titleEn: "Math",
      totalQuestion: 120,
      done: 94,
      subTitle: "Chapter 3",
    },
    {
      ...SUBJECT_META.physics,
      title: "ရူပဗေဒ",
      titleEn: "Phys",
      totalQuestion: 100,
      done: 61,
      subTitle: "Chapter 5",
    },
    {
      ...SUBJECT_META.chemistry,
      title: "ဓာတုဗေဒ",
      titleEn: "Chem",
      totalQuestion: 110,
      done: 78,
      subTitle: "Chapter 4",
    },
    {
      ...SUBJECT_META.biology,
      title: "ဇီဝဗေဒ",
      titleEn: "Bio",
      totalQuestion: 90,
      done: 45,
      subTitle: "Chapter 2",
    },
    {
      ...SUBJECT_META.english,
      title: "အင်္ဂလိပ်",
      titleEn: "Eng",
      totalQuestion: 100,
      done: 88,
      subTitle: "Unit 7",
    },
    {
      ...SUBJECT_META.myanmar,
      title: "မြန်မာစာ",
      titleEn: "Myan",
      totalQuestion: 95,
      done: 70,
      subTitle: "အခန်း ၆",
    },
  ];

  const recentResults: RecentResult[] = [
    {
      ...SUBJECT_META.maths,
      title: "သင်္ချာ",
      titleEn: "Math • Chapter 3",
      date: "Today, 4:20 PM",
      score: 88,
      total: 100,
      grade: "A",
    },
    {
      ...SUBJECT_META.physics,
      title: "ရူပဗေဒ",
      titleEn: "Phys • Chapter 5",
      date: "Yesterday, 6:15 PM",
      score: 76,
      total: 100,
      grade: "B",
    },
    {
      ...SUBJECT_META.english,
      title: "အင်္ဂလိပ်",
      titleEn: "Eng • Unit 7",
      date: "Sep 24, 8:00 PM",
      score: 92,
      total: 100,
      grade: "A",
    },
  ];

  return (
    <View
      className="flex-1 bg-pg-background"
      style={{ paddingTop: insets.top }}
    >
      <ScrollView
        className="flex-1 bg-pg-background"
        contentContainerClassName="px-4"
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
        {/* ── Header ─────────────────────────────────────── */}
        <View className="w-full pt-2 flex flex-row justify-between items-center">
          <Box>
            <View className="flex-row items-center gap-2">
              <Text className="font-heading text-[26px] text-foreground">
                Tests
              </Text>
            </View>
            <Text className="font-body text-[13px] text-muted-foreground mt-0.5">
              စာမေးပွဲ ပြင်ဆင်ခြင်း • Matric & Chapter
            </Text>
          </Box>
          <Pressable
            onPress={() => searchRef.current?.focus?.()}
            accessibilityRole="button"
            accessibilityLabel="Start a new chat"
            accessibilityHint="Focuses the search field to find a teacher"
            className="rounded-full bg-primary w-12 h-12 justify-center items-center active:opacity-80"
            style={{ elevation: 2 }}
          >
            <ThemedIcon
              as={Bell}
              size={20}
              className="text-primary-foreground"
            />
          </Pressable>
        </View>

        <Box className="mt-4 bg-primary rounded-3xl flex flex-row items-center justify-center p-4 gap-2">
          <View className="w-5/7 flex gap-2">
            <Text className="uppercase text-primary-foreground/80 font-heading text-sm">
              Matric exam coountdown
            </Text>
            <View className="flex flex-row gap-2 items-end">
              <Text className="font-heading text-xl text-primary-foreground">
                142
              </Text>
              <Text className="font-heading text-primary-foreground/80">
                days
              </Text>
            </View>
            <Text className="text-primary-foreground/80 font-body text-sm">
              October 2026 • 6 Subject remaining
            </Text>
          </View>
          <View className="w-2/7 gap-2">
            <Box className="w-full bg-primary-foreground/20 rounded-2xl py-2 flex justify-center items-center">
              <Text className="text-primary-foreground font-heading text-lg">
                78%
              </Text>
              <Text className="text-primary-foreground/80 font-heading">
                Ready
              </Text>
            </Box>
            <Button variant="secondary" className="rounded-full px-1 py-3">
              <ButtonText className="font-heading text-primary">
                Full Mock
              </ButtonText>
            </Button>
          </View>
        </Box>

        <View className="mt-4">
          <SectionHeader
            title="QUICK PRATICE • မြန်မြန်လေ့ကျင့်"
            action="All"
          />
          <Grid className="gap-2 mt-2" _extra={{ className: "grid-cols-3" }}>
            <GridItem
              className="bg-card aspect-square p-2 flex items-center justify-center rounded-3xl gap-2"
              _extra={{ className: "" }}
            >
              <View className="bg-secondary/20 rounded-2xl size-13 flex items-center justify-center">
                <ThemedIcon as={Timer} size={25} />
              </View>
              <Text className="font-heading text-sm text-center">
                Timed Mock
              </Text>
            </GridItem>
            <GridItem
              className="bg-primary aspect-square p-2 flex items-center justify-center rounded-3xl gap-2"
              _extra={{ className: "" }}
            >
              <View className="bg-primary-foreground/20 rounded-2xl size-13 flex items-center justify-center">
                <ThemedIcon
                  as={Zap}
                  size={25}
                  className="text-primary-foreground"
                />
              </View>
              <Text className="font-heading text-sm text-center text-primary-foreground">
                Daily Challenge
              </Text>
            </GridItem>
            <GridItem
              className="bg-card aspect-square p-2 flex items-center justify-center rounded-3xl gap-2"
              _extra={{ className: "" }}
            >
              <View className="bg-accent rounded-2xl size-13 flex items-center justify-center">
                <ThemedIcon
                  as={RefreshCcw}
                  size={25}
                  className="text-accent-foreground"
                />
              </View>
              <Text className="font-heading text-sm text-center">
                Retry Wrong
              </Text>
            </GridItem>
          </Grid>
        </View>

        <View className="mt-4">
          <SectionHeader title="BY SUBJECT • ဘာသာရပ်အလိုက်" action="All" />
          <View className="mt-2 gap-2">
            {subjectTasks.map((task) => (
              <SubjectTaskCard key={task.id} task={task} />
            ))}
          </View>
        </View>

        <View className="mt-4">
          <SectionHeader title="Recent Results • မကြာသေးမီဖြေဆိုမှုများ" />
          <View className="mt-2 gap-2">
            {recentResults.map((result) => (
              <RecentResultCard key={`${result.id}-${result.date}`} result={result} />
            ))}
          </View>
        </View>

        <Box className="w-full flex-row justify-center items-center mt-8 gap-1.5">
          <ThemedIcon
            as={CircleCheck}
            size={15}
            className="text-muted-foreground"
          />
          <Text className="font-body text-[13px] text-muted-foreground">
            You&apos;re all caught up 🎉
          </Text>
        </Box>
      </ScrollView>
    </View>
  );
}
