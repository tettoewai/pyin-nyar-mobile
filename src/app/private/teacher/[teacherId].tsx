import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { ThemedIcon } from "@/components/ui/icon";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Bookmark,
  Calculator,
  Camera,
  ChartColumn,
  ChevronDown,
  ChevronLeft,
  CirclePlay,
  GraduationCap,
  Hash,
  Languages,
  MessagesSquare,
  Mic,
  MoreVertical,
  Share2,
  SquareFunction,
  Star,
  Triangle,
  Users,
  Zap,
} from "lucide-react-native";
import { useState } from "react";
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AVATAR_URI =
  "https://storage.googleapis.com/banani-generated-images/generated-images/25d56666-863f-48f1-8118-82fb9938006f.jpg";

const TEACHER_META: Record<string, { name: string; subject: string }> = {
  saya_maung: { name: "Saya Maung", subject: "သင်္ချာ · Maths" },
  sayarma_thida: { name: "Sayarma Thida", subject: "အင်္ဂလိပ် · English" },
  sayar_aung: { name: "Sayar Aung", subject: "ရူပဗေဒ · Physics" },
  sayarma_nilar: { name: "Sayarma Nilar", subject: "ဓာတု · Chemistry" },
  sayar_ko: { name: "Sayar Ko", subject: "ဇီဝ · Biology" },
  sayarma_hla: { name: "Sayarma Hla", subject: "မြန်မာ · Myanmar" },
};

const STATS = [
  { value: "2.4K", label: "Students", icon: Users, iconClass: "text-primary" },
  { value: "340", label: "Lessons", icon: BookOpen, iconClass: "text-primary" },
  { value: "4.9", label: "Rating", icon: Star, iconClass: "text-secondary" },
  {
    value: "8yr",
    label: "Exp.",
    icon: GraduationCap,
    iconClass: "text-primary",
  },
];

const SPECIALTIES = [
  "Quadratic Eq.",
  "Trigonometry",
  "Calculus",
  "Statistics",
  "Algebra",
  "Matric Prep",
];

const CHAPTERS = [
  {
    title: "ကိန်းဂဏန်း",
    subtitle: "Number Theory • 12 lessons",
    icon: Hash,
  },
  {
    title: "Quadratic Eq.",
    subtitle: "Quadratic Equations • 18 lessons",
    icon: SquareFunction,
  },
  {
    title: "Trigonometry",
    subtitle: "Trigonometry • 15 lessons",
    icon: Triangle,
  },
  {
    title: "Statistics",
    subtitle: "Statistics & Prob. • 10 lessons",
    icon: ChartColumn,
  },
];

const RATING_BARS = [
  { star: "5", width: "90%" },
  { star: "4", width: "7%" },
  { star: "3", width: "2%" },
  { star: "2", width: "1%" },
  { star: "1", width: "0%" },
];

const REVIEWS = [
  {
    name: "Ma Thiri",
    grade: "Grade 10",
    avatar:
      "https://storage.googleapis.com/banani-avatars/avatar/female/13-17/Southeast Asian/3",
    stars: 5,
    text: "Saya Maung explains so clearly! Quadratic ကို ၁၀ မိနစ်အတွင်း နားလည်သွားတယ် 🎉",
  },
  {
    name: "Ko Aung",
    grade: "Grade 11",
    avatar:
      "https://storage.googleapis.com/banani-avatars/avatar/male/13-17/Southeast Asian/2",
    stars: 5,
    text: "Bilingual explanations are the best. မြန်မာနဲ့ English တစ်ပြိုင်နက် ရှင်းပြတာ အရမ်းကောင်း",
  },
  {
    name: "Ma Nwe",
    grade: "Grade 9",
    avatar:
      "https://storage.googleapis.com/banani-avatars/avatar/female/13-17/Southeast Asian/5",
    stars: 4,
    text: "Photo scan feature helped me solve my homework instantly. Thanks Saya!",
  },
];

function Stars({ count, size = 12 }: { count: number; size?: number }) {
  return (
    <View className="flex-row gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <ThemedIcon key={i} as={Star} size={size} className="text-secondary" />
      ))}
    </View>
  );
}

export default function TeacherProfile() {
  const { teacherId, tutorId } = useLocalSearchParams<{
    teacherId?: string;
    tutorId?: string;
  }>();
  const rawId = teacherId ?? tutorId;
  const id = Array.isArray(rawId) ? rawId[0] : (rawId ?? "saya_maung");
  const meta = TEACHER_META[id] ?? TEACHER_META.saya_maung;

  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [saved, setSaved] = useState(false);

  const openChat = () => router.push(`/tutor/${id}`);

  return (
    <View
      className="flex-1 bg-pg-background"
      style={{ paddingTop: insets.top }}
    >
      <ScrollView
        scrollsToTop={false}
        className="flex-1 bg-pg-background"
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, 16) + 24,
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
        {/* ── Header ─────────────────────────────────────────── */}
        <View className="bg-primary">
          <View className="px-5 pt-2 flex-row items-center justify-between">
            <Button
              size="icon"
              accessibilityLabel="Back"
              className="w-9 h-9 rounded-full bg-primary-foreground/20"
              onPress={() => router.back()}
            >
              <ButtonIcon
                as={ChevronLeft}
                className="text-primary-foreground"
              />
            </Button>
            <Button
              size="icon"
              accessibilityLabel="More options"
              className="w-9 h-9 rounded-full bg-primary-foreground/20"
            >
              <ButtonIcon
                as={MoreVertical}
                className="text-primary-foreground"
              />
            </Button>
          </View>

          <View className="flex-col items-center pb-6 pt-3 px-5">
            <View className="relative">
              <Image
                source={{ uri: AVATAR_URI }}
                className="w-24 h-24 rounded-full border-4 border-secondary"
                accessibilityLabel={`${meta.name} avatar`}
              />
              <View className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-secondary" />
            </View>

            <Text className="font-heading font-extrabold text-2xl text-primary-foreground mt-3 text-center">
              {meta.name}
            </Text>
            <Text className="font-body font-medium text-sm text-primary-foreground opacity-70 mt-0.5 text-center">
              AI Mathematics Teacher
            </Text>

            <View className="flex-row items-center gap-2 mt-3 flex-wrap justify-center">
              <Box className="bg-secondary rounded-full px-3 py-1.5 flex-row items-center gap-1.5">
                <ThemedIcon
                  as={Calculator}
                  size={13}
                  className="text-secondary-foreground"
                />
                <Text className="font-body font-bold text-xs text-secondary-foreground">
                  Maths
                </Text>
              </Box>
              <Box className="bg-primary-foreground/20 rounded-full px-3 py-1.5 flex-row items-center gap-1.5">
                <ThemedIcon
                  as={BadgeCheck}
                  size={13}
                  className="text-primary-foreground"
                />
                <Text className="font-body font-bold text-xs text-primary-foreground">
                  Verified Tutor
                </Text>
              </Box>
              <Box className="bg-primary-foreground/20 rounded-full px-3 py-1.5 flex-row items-center gap-1.5">
                <ThemedIcon
                  as={Star}
                  size={13}
                  className="text-primary-foreground"
                />
                <Text className="font-body font-bold text-xs text-primary-foreground">
                  4.9 Rating
                </Text>
              </Box>
            </View>

            <View className="flex-row gap-3 mt-4 w-full">
              <Button
                size="lg"
                className="flex-1 bg-secondary rounded-full"
                onPress={openChat}
              >
                <ButtonIcon
                  as={MessagesSquare}
                  className="text-secondary-foreground"
                />
                <ButtonText className="font-heading text-secondary-foreground">
                  Start Chat
                </ButtonText>
              </Button>
              <Button
                size="icon"
                accessibilityLabel={saved ? "Unsave tutor" : "Save tutor"}
                className={`w-12 h-12 rounded-full ${saved ? "bg-secondary" : "bg-primary-foreground/20"}`}
                onPress={() => setSaved((s) => !s)}
              >
                <ButtonIcon
                  as={Bookmark}
                  className={
                    saved
                      ? "text-secondary-foreground"
                      : "text-primary-foreground"
                  }
                />
              </Button>
              <Button
                size="icon"
                accessibilityLabel="Share tutor"
                className="w-12 h-12 rounded-full bg-primary-foreground/20"
              >
                <ButtonIcon as={Share2} className="text-primary-foreground" />
              </Button>
            </View>
          </View>
        </View>

        {/* ── Stats ──────────────────────────────────────────── */}
        <View className="flex-row gap-2 px-5 mt-4">
          {STATS.map((s) => (
            <View
              key={s.label}
              className="flex-1 bg-card border border-border rounded-xl p-3 flex-col items-center gap-1"
            >
              <ThemedIcon as={s.icon} size={18} className={s.iconClass} />
              <Text className="font-heading font-extrabold text-base text-foreground">
                {s.value}
              </Text>
              <Text className="font-body font-medium text-xs text-muted-foreground text-center">
                {s.label}
              </Text>
            </View>
          ))}
        </View>

        {/* ── About ──────────────────────────────────────────── */}
        <View className="mx-5 mt-4 bg-card border border-border rounded-xl p-4">
          <Text className="font-heading font-extrabold text-sm text-foreground leading-loose">
            About • အကြောင်းအရာ
          </Text>
          <Text className="font-body font-medium text-sm text-muted-foreground leading-relaxed mt-2">
            {meta.name} specialises in Maths for Grade 9–12 Myanmar students.
            Known for clear step-by-step explanations and bilingual breakdowns
            that make hard topics feel easy.
          </Text>
          <Text className="font-body font-medium text-sm text-muted-foreground mt-1 leading-loose">
            သင်္ချာဖြေဆိုနည်းများကို မြန်မာဘာသာနှင့် English နှစ်မျိုးနှစ်ဘာသာ
            ရှင်းပြပေးသည်။
          </Text>

          <View className="mt-3 pt-3 border-t border-border">
            <Text className="font-body font-bold text-xs text-muted-foreground mb-2">
              SPECIALTIES
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {SPECIALTIES.map((tag) => (
                <Box key={tag} className="bg-muted rounded-full px-3 py-1">
                  <Text className="font-body font-bold text-xs text-foreground">
                    {tag}
                  </Text>
                </Box>
              ))}
            </View>
          </View>

          <View className="mt-3 pt-3 border-t border-border flex-col gap-2">
            <View className="flex-row items-center gap-2">
              <ThemedIcon as={Zap} size={15} className="text-secondary" />
              <Text className="font-body font-medium text-sm text-foreground">
                Replies within 5 seconds
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <ThemedIcon as={Languages} size={15} className="text-primary" />
              <Text className="font-body font-medium text-sm text-foreground leading-loose">
                Bilingual — မြန်မာ + English
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <ThemedIcon
                as={Camera}
                size={15}
                className="text-muted-foreground"
              />
              <Text className="font-body font-medium text-sm text-foreground">
                Supports photo problem solving
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <ThemedIcon
                as={Mic}
                size={15}
                className="text-muted-foreground"
              />
              <Text className="font-body font-medium text-sm text-foreground">
                Voice explanation available
              </Text>
            </View>
          </View>
        </View>

        {/* ── Chapters ───────────────────────────────────────── */}
        <View className="mx-5 mt-4 bg-card border border-border rounded-xl p-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="font-heading font-extrabold text-sm text-foreground">
              Chapters Covered
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="See all 12 chapters"
            >
              <Text className="font-body font-bold text-xs text-primary">
                See all 12
              </Text>
            </Pressable>
          </View>
          <View className="flex-col gap-2.5">
            {CHAPTERS.map((c) => (
              <Pressable
                key={c.title}
                accessibilityRole="button"
                accessibilityLabel={c.title}
                className="flex-row items-center gap-3 active:opacity-70"
              >
                <View className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <ThemedIcon
                    as={c.icon}
                    size={17}
                    className="text-foreground"
                  />
                </View>
                <View className="flex-1 min-w-0">
                  <Text
                    numberOfLines={1}
                    className="font-heading font-extrabold text-sm text-foreground leading-loose"
                  >
                    {c.title}
                  </Text>
                  <Text
                    numberOfLines={1}
                    className="font-body font-medium text-xs text-muted-foreground"
                  >
                    {c.subtitle}
                  </Text>
                </View>
                <ThemedIcon
                  as={CirclePlay}
                  size={18}
                  className="text-primary"
                />
              </Pressable>
            ))}
          </View>
        </View>

        {/* ── Reviews ────────────────────────────────────────── */}
        <View className="mx-5 mt-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="font-heading font-extrabold text-sm text-foreground leading-loose">
              Student Reviews • သုံးသပ်ချက်
            </Text>
            <View className="flex-row items-center gap-1">
              <ThemedIcon as={Star} size={14} className="text-secondary" />
              <Text className="font-heading font-extrabold text-sm text-foreground">
                4.9
              </Text>
              <Text className="font-body font-medium text-xs text-muted-foreground">
                (128)
              </Text>
            </View>
          </View>

          <View className="bg-card border border-border rounded-xl p-4 mb-3">
            <View className="flex-row items-center gap-3">
              <View className="flex-col items-center">
                <Text className="font-heading font-extrabold text-4xl text-foreground">
                  4.9
                </Text>
                <View className="flex-row gap-0.5 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <ThemedIcon
                      key={i}
                      as={Star}
                      size={12}
                      className="text-secondary"
                    />
                  ))}
                </View>
                <Text className="font-body font-medium text-xs text-muted-foreground mt-1">
                  128 reviews
                </Text>
              </View>
              <View className="flex-1 flex-col gap-1.5">
                {RATING_BARS.map((b) => (
                  <View key={b.star} className="flex-row items-center gap-2">
                    <Text className="font-body font-bold text-xs text-muted-foreground w-2">
                      {b.star}
                    </Text>
                    <View className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <View
                        className="h-full rounded-full bg-secondary"
                        style={{ width: b.width as `${number}%` }}
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View className="flex-col gap-2.5">
            {REVIEWS.map((r) => (
              <View
                key={r.name}
                className="bg-card border border-border rounded-xl p-4"
              >
                <View className="flex-row items-center gap-2.5">
                  <Image
                    source={{ uri: r.avatar }}
                    className="w-9 h-9 rounded-full"
                  />
                  <View className="flex-1 min-w-0">
                    <Text
                      numberOfLines={1}
                      className="font-heading font-extrabold text-sm text-foreground"
                    >
                      {r.name}
                    </Text>
                    <Text className="font-body font-medium text-xs text-muted-foreground leading-loose">
                      {r.grade}
                    </Text>
                  </View>
                  <Stars count={r.stars} />
                </View>
                <Text className="font-body font-medium text-sm text-foreground leading-loose mt-2.5">
                  {r.text}
                </Text>
              </View>
            ))}
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="See all 128 reviews"
            className="mt-3 w-full bg-card border border-border rounded-full py-3 flex-row items-center justify-center gap-2 active:opacity-70"
          >
            <Text className="font-heading font-extrabold text-sm text-foreground">
              See all 128 reviews
            </Text>
            <ThemedIcon
              as={ChevronDown}
              size={16}
              className="text-foreground"
            />
          </Pressable>
        </View>

        {/* ── CTA ────────────────────────────────────────────── */}
        <View className="mx-5 mt-5 mb-5 bg-card border border-border rounded-xl p-4 flex-row items-center gap-3">
          <View className="flex-1">
            <Text className="font-heading font-extrabold text-sm text-foreground">
              Ready to start learning?
            </Text>
            <Text className="font-body text-xs text-muted-foreground">
              {meta.name} is online now
            </Text>
          </View>
          <Button className="bg-primary rounded-full px-5" onPress={openChat}>
            <ButtonText className="font-heading text-primary-foreground">
              Chat
            </ButtonText>
            <ButtonIcon as={ArrowRight} className="text-primary-foreground" />
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
