import { Box } from "@/components/ui/box";
import { ThemedIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Link, useLocalSearchParams } from "expo-router";
import {
  ArrowRight,
  BadgeCheck,
  Bookmark,
  Camera,
  CheckCheck,
  ChevronLeft,
  CircleHelp,
  EllipsisVertical,
  Image as ImageIcon,
  Languages,
  Mic,
  Pause,
  PenLine,
  Phone,
  Play,
  Plus,
  SendHorizontal,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Video,
  X,
} from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AVATAR_URI =
  "https://storage.googleapis.com/banani-generated-images/generated-images/25d56666-863f-48f1-8118-82fb9938006f.jpg";
const HOMEWORK_URI =
  "https://storage.googleapis.com/banani-generated-images/generated-images/81c8a32e-dcb9-4c40-bd6b-c3fbeac8a8b4.jpg";

const TEACHER_META: Record<string, { name: string; subject: string }> = {
  saya_maung: { name: "Saya Maung", subject: "သင်္ချာ · Maths" },
  sayarma_thida: { name: "Sayarma Thida", subject: "အင်္ဂလိပ် · English" },
  sayar_aung: { name: "Sayar Aung", subject: "ရူပဗေဒ · Physics" },
  sayarma_nilar: { name: "Sayarma Nilar", subject: "ဓာတု · Chemistry" },
  sayar_ko: { name: "Sayar Ko", subject: "ဇီဝ · Biology" },
  sayarma_hla: { name: "Sayarma Hla", subject: "မြန်မာ · Myanmar" },
};

type DynamicMessage = {
  id: string;
  from: "user" | "assistant";
  text: string;
  time: string;
};

const STEPS = [
  {
    title: "Find two numbers",
    detail: "ပေါင်းရင် 5၊ မြှောက်ရင် 6 ရမယ် → 2 နဲ့ 3",
    highlight: false,
  },
  {
    title: "Write as factors",
    detail: "(x + 2)(x + 3) = 0",
    highlight: true,
  },
  {
    title: "Answer: x = −2, −3 🎉",
    detail: "အစားထိုးစစ်ကြည့် — မှန်တယ်!",
    highlight: false,
  },
];

const QUICK_REPLIES = [
  {
    label: "Why 2 and 3?",
    emoji: "🤔",
    value: "Why 2 and 3?",
    icon: CircleHelp,
    primary: false,
  },
  {
    label: "Give me quiz",
    emoji: "📝",
    value: "Give me quiz",
    icon: PenLine,
    primary: false,
  },
  {
    label: "Next step",
    emoji: "",
    value: "Next step",
    icon: ArrowRight,
    primary: true,
  },
];

const ATTACH_ACTIONS = [
  { label: "Photo", icon: Camera, value: "📷 Photo of my homework" },
  { label: "Gallery", icon: ImageIcon, value: "📷 Scan this problem" },
  { label: "Voice", icon: Mic, value: "🎤 Voice question" },
  { label: "Translate", icon: Languages, value: "Translate this please" },
];

function cannedReply(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("quiz"))
    return "Quiz ready! ✍️\n1) x² + 7x + 12 = 0 ကို factor ခွဲကြည့်\n2) x² − 9 = 0 ရဲ့ အဖြေက ဘာလဲ?\n3) (x+4)(x+1) ကို ဖြန့်ကြည့် — ပြီးရင် ပို့လိုက်ပါ!";
  if (t.includes("why"))
    return "Good question! 🤔 2 နဲ့ 3 ကို ရွေးရတာက — ပေါင်းရင် 5 (middle term)၊ မြှောက်ရင် 6 (constant) ရလို့ပါ။ ဒါကို FOIL နဲ့ ပြန်စစ်ကြည့်လို့ရတယ်!";
  if (t.includes("next"))
    return "Next step → အလားတူ ပုစ္ဆာတစ်ပုဒ် ကိုယ်တိုင်ဖြေကြည့်ပါ: x² + 7x + 10 = 0။ အဖြေရရင် ပို့လိုက်နော်! 💪";
  if (t.includes("photo") || t.includes("scan") || t.includes("📷"))
    return "ဓာတ်ပုံရပါပြီ! 📷 ပုစ္ဆာကို ကြည့်ပြီး အဆင့်ဆင့် ရှင်းပြပေးမယ်နော် — အရင်ဆုံး ဘယ်အပုဒ်က အခက်ဆုံးလဲ ပြောပြပါ။";
  if (t.includes("translate"))
    return "Translate mode! 🌐 English ↔ မြန်မာ — ဘာသာပြန်ချင်တဲ့ စာကြောင်းကို ပို့လိုက်ပါ။";
  if (t.includes("🎤"))
    return "Voice note ရပါပြီ! 🎧 နားထောင်ပြီး ပြန်ဖြေပေးမယ်နော် — ခဏစောင့်ပါ။";
  return `Got it! Let's solve together — "${text}" ကို အတူတူကြည့်ကြမယ်။ အသေးစိတ်လေး ထပ်ပို့ပေးပါနော်!`;
}

function nowTime(): string {
  return new Date()
    .toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    .replace(" ", " ");
}

function TypingDots() {
  const [values] = useState(
    () => [new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)],
  );

  useEffect(() => {
    const loops = values.map((v, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 180),
          Animated.timing(v, {
            toValue: 1,
            duration: 380,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(v, {
            toValue: 0,
            duration: 380,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ),
    );
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View className="flex-row items-center gap-1.5">
      {values.map((v, i) => (
        <Animated.View
          key={i}
          className={`w-2 h-2 rounded-full ${i === 2 ? "bg-primary" : "bg-muted-foreground"}`}
          style={{
            opacity: v.interpolate({
              inputRange: [0, 1],
              outputRange: [0.35, 1],
            }),
            transform: [
              {
                translateY: v.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -3],
                }),
              },
            ],
          }}
        />
      ))}
    </View>
  );
}

export default function TeacherChat() {
  const { tutorId } = useLocalSearchParams<{ tutorId: string }>();
  const key = Array.isArray(tutorId) ? tutorId[0] : (tutorId ?? "");
  const meta = TEACHER_META[key] ?? TEACHER_META.saya_maung;
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const idRef = useRef(0);
  const replyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [thread, setThread] = useState<DynamicMessage[]>([]);
  const [input, setInput] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [sending, setSending] = useState(false);
  const [quizPending, setQuizPending] = useState(false);
  const [feedback, setFeedback] = useState<"helpful" | "confusing" | null>(
    null,
  );
  const [saved, setSaved] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [voiceProgress, setVoiceProgress] = useState(0.35);
  const [showChips, setShowChips] = useState(true);
  const [showAttach, setShowAttach] = useState(false);

  useEffect(() => {
    return () => {
      if (replyTimer.current) clearTimeout(replyTimer.current);
    };
  }, []);

  // Advance the voice-note progress bar while playing.
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setVoiceProgress((p) => {
        if (p >= 1) {
          setPlaying(false);
          return 0.35;
        }
        return Math.min(1, p + 0.02);
      });
    }, 200);
    return () => clearInterval(t);
  }, [playing]);

  const nextId = () => `m-${++idRef.current}`;

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text || sending) return;
      if (replyTimer.current) clearTimeout(replyTimer.current);
      setQuizPending(text.toLowerCase().includes("quiz"));
      setThread((prev) => [
        ...prev,
        { id: nextId(), from: "user", text, time: nowTime() },
      ]);
      setInput("");
      setShowAttach(false);
      setSending(true);
      scrollToEnd();
      replyTimer.current = setTimeout(() => {
        setThread((prev) => [
          ...prev,
          {
            id: nextId(),
            from: "assistant",
            text: cannedReply(text),
            time: nowTime(),
          },
        ]);
        setSending(false);
        scrollToEnd();
      }, 1200);
    },
    [sending, scrollToEnd],
  );

  const hasInput = input.trim().length > 0;
  const voiceSeconds = Math.round(voiceProgress * 72); // 1:12 total
  const voiceLabel = `0:${String(voiceSeconds).padStart(2, "0")} / 1:12`;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <View className="flex-1 bg-background">
        {/* ── Header ─────────────────────────────────────────── */}
        <View
          className="bg-card border-b border-border px-3 pb-3 shadow-sm"
          style={{
            paddingTop: Math.max(insets.top, 10),
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2,
          }}
        >
          <View className="flex-row items-center gap-2">
            <Link href="/tutor" asChild>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back to tutors"
                className="w-10 h-10 rounded-full bg-muted items-center justify-center active:opacity-70"
              >
                <ThemedIcon
                  as={ChevronLeft}
                  className="text-foreground"
                  size={21}
                />
              </Pressable>
            </Link>

            <View className="relative">
              <Image
                source={{ uri: AVATAR_URI }}
                className="w-11 h-11 rounded-full border border-border"
                accessibilityLabel={`${meta.name} avatar`}
              />
              <View
                className="absolute -right-0.5 -bottom-0.5 w-3.5 h-3.5 rounded-full bg-primary border-2 border-card"
                accessibilityLabel="Online"
              />
            </View>

            <View className="flex-1 min-w-0">
              <View className="flex-row items-center gap-1.5">
                <Text
                  numberOfLines={1}
                  className="font-heading text-[15px] text-foreground"
                >
                  {meta.name}
                </Text>
                <ThemedIcon
                  as={BadgeCheck}
                  className="text-primary"
                  size={15}
                />
              </View>
              <View className="mt-0.5 flex-row items-center gap-1.5">
                <View className="w-1.5 h-1.5 rounded-full bg-primary" />
                <Text
                  numberOfLines={1}
                  className="font-body text-xs text-muted-foreground"
                >
                  Online · {meta.subject}
                  {sending ? " · typing…" : ""}
                </Text>
              </View>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Voice call"
              className="w-10 h-10 rounded-full bg-muted items-center justify-center active:opacity-70"
            >
              <ThemedIcon as={Phone} className="text-foreground" size={17} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Video call"
              className="w-10 h-10 rounded-full bg-muted items-center justify-center active:opacity-70"
            >
              <ThemedIcon as={Video} className="text-foreground" size={18} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="More options"
              className="w-9 h-10 rounded-full items-center justify-center active:opacity-70"
            >
              <ThemedIcon
                as={EllipsisVertical}
                className="text-muted-foreground"
                size={19}
              />
            </Pressable>
          </View>
        </View>

        {/* ── Thread ─────────────────────────────────────────── */}
        <ScrollView
          ref={scrollRef}
          className="flex-1"
          contentContainerClassName="px-4 pt-4 pb-2 flex-col gap-4"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          onContentSizeChange={scrollToEnd}
          onLayout={scrollToEnd}
        >
          <View className="flex-row justify-center">
            <Box
              className="bg-card border border-border rounded-full px-3.5 py-1.5 shadow-sm"
              style={{ elevation: 1 }}
            >
              <Text className="font-body font-bold text-[11px] text-muted-foreground tracking-wide">
                TODAY • 4:20 PM
              </Text>
            </Box>
          </View>

          {/* User photo + question */}
          <View className="flex-row justify-end">
            <View className="max-w-[85%]">
              <View
                className="rounded-2xl rounded-br-md overflow-hidden border border-border bg-card shadow-sm"
                style={{ elevation: 1 }}
              >
                <Image
                  source={{ uri: HOMEWORK_URI }}
                  style={{ aspectRatio: 4 / 3 }}
                  className="w-full"
                  resizeMode="cover"
                  accessibilityLabel="Photo of handwritten maths homework"
                />
                <View className="px-3 py-2 flex-row items-center gap-1.5 bg-card">
                  <ThemedIcon
                    as={Camera}
                    size={13}
                    className="text-muted-foreground"
                  />
                  <Text className="font-body text-[11px] text-muted-foreground">
                    homework.jpg · sent by you
                  </Text>
                </View>
              </View>
              <View className="mt-2 bg-primary rounded-2xl rounded-br-md px-4 py-3 shadow-sm">
                <Text className="font-body font-medium text-[14px] text-primary-foreground leading-snug">
                  ဒီပုစ္ဆာလေး ရှင်းပြပေးပါ — x² + 5x + 6 = 0 ကို factor နဲ့
                  ဘယ်လိုဖြေလဲ?
                </Text>
              </View>
              <View className="mt-1 flex-row items-center justify-end gap-1">
                <Text className="font-body font-medium text-[11px] text-muted-foreground">
                  Seen • 4:21 PM
                </Text>
                <ThemedIcon
                  as={CheckCheck}
                  size={14}
                  className="text-primary"
                />
              </View>
            </View>
          </View>

          {/* Assistant solution card */}
          <View className="flex-row gap-2.5">
            <Image
              source={{ uri: AVATAR_URI }}
              className="w-8 h-8 rounded-full shrink-0 border border-border mt-1"
            />
            <View className="flex-1 flex-col gap-2.5 min-w-0">
              <View
                className="bg-card border border-border rounded-2xl rounded-tl-md p-4 shadow-sm"
                style={{ elevation: 1 }}
              >
                <View className="flex-row items-center gap-2">
                  <View className="w-7 h-7 rounded-full bg-accent items-center justify-center shrink-0">
                    <ThemedIcon
                      as={Sparkles}
                      className="text-accent-foreground"
                      size={14}
                    />
                  </View>
                  <Text className="font-heading font-extrabold text-[13.5px] text-foreground flex-1 leading-snug">
                    Got it! Let’s solve together — အတူတူဖြေကြမယ်
                  </Text>
                </View>

                <View className="mt-2.5 flex-row items-center gap-2">
                  <Box className="bg-accent rounded-full px-2.5 py-1">
                    <Text className="font-body font-bold text-[11px] text-accent-foreground">
                      📐 Algebra
                    </Text>
                  </Box>
                  <Box className="bg-muted rounded-full px-2.5 py-1">
                    <Text className="font-body font-bold text-[11px] text-muted-foreground">
                      Step 2 of 3
                    </Text>
                  </Box>
                </View>

                {/* Progress */}
                <View className="mt-2.5 h-1.5 rounded-full bg-muted overflow-hidden">
                  <View className="h-full w-2/3 rounded-full bg-primary" />
                </View>

                <View className="mt-3 bg-primary rounded-xl px-4 py-3.5 items-center justify-center">
                  <Text className="font-heading font-extrabold text-[19px] text-primary-foreground tracking-wide">
                    x² + 5x + 6 = 0
                  </Text>
                  <Text className="mt-0.5 font-body text-[11px] text-primary-foreground opacity-80">
                    Tap a step to hear it read aloud 🔊
                  </Text>
                </View>

                <View className="mt-3.5 flex-col gap-0">
                  {STEPS.map((step, i) => {
                    const isLast = i === STEPS.length - 1;
                    return (
                      <View key={step.title} className="flex-row gap-3">
                        <View className="flex-col items-center">
                          <View
                            className={`w-6 h-6 rounded-full items-center justify-center ${isLast ? "bg-secondary" : "bg-accent"}`}
                          >
                            <Text
                              className={`font-heading font-extrabold text-xs ${isLast ? "text-secondary-foreground" : "text-accent-foreground"}`}
                            >
                              {isLast ? "✓" : i + 1}
                            </Text>
                          </View>
                          {!isLast && (
                            <View className="w-0.5 flex-1 bg-border my-1 rounded-full" />
                          )}
                        </View>
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={`Step ${i + 1}: ${step.title}`}
                          className={`pb-3 flex-1 rounded-lg px-2.5 py-2 -mt-1 active:opacity-80 ${step.highlight ? "bg-accent/60 border border-primary/20" : ""}`}
                        >
                          <Text className="font-body font-bold text-[13.5px] text-foreground">
                            {step.title}
                          </Text>
                          <Text
                            className={`font-body text-[13.5px] leading-snug mt-0.5 ${step.highlight ? "font-heading font-extrabold text-primary" : "text-muted-foreground font-medium"}`}
                          >
                            {step.detail}
                          </Text>
                        </Pressable>
                      </View>
                    );
                  })}
                </View>

                {/* Voice note */}
                <Pressable
                  onPress={() => setPlaying((p) => !p)}
                  accessibilityRole="button"
                  accessibilityLabel={
                    playing ? "Pause voice explanation" : "Play voice explanation"
                  }
                  accessibilityHint="Plays a 72 second voice note"
                  className="mt-2 w-full bg-muted rounded-xl px-3 py-2.5 flex-row items-center gap-2.5 active:opacity-80"
                >
                  <View className="w-9 h-9 rounded-full bg-primary items-center justify-center shrink-0">
                    <ThemedIcon
                      as={playing ? Pause : Play}
                      className="text-primary-foreground"
                      size={15}
                    />
                  </View>
                  <View className="flex-1 min-w-0">
                    <View className="h-1.5 rounded-full bg-border relative overflow-hidden">
                      <View
                        className="absolute left-0 top-0 h-full rounded-full bg-primary"
                        style={{ width: `${Math.round(voiceProgress * 100)}%` }}
                      />
                    </View>
                    <Text className="mt-1 font-body font-bold text-[11px] text-muted-foreground">
                      {playing ? "Playing…" : "Voice explanation"} · {voiceLabel}
                    </Text>
                  </View>
                </Pressable>
              </View>

              {/* Quick replies */}
              {showChips && (
                <View className="flex-col gap-1.5">
                  <View className="flex-row items-center justify-between px-0.5">
                    <Text className="font-body font-bold text-[11px] text-muted-foreground tracking-wide">
                      SUGGESTED • အကြံပြုစကား
                    </Text>
                    <Pressable
                      onPress={() => setShowChips(false)}
                      accessibilityRole="button"
                      accessibilityLabel="Dismiss suggestions"
                      className="w-6 h-6 rounded-full items-center justify-center active:opacity-70"
                    >
                      <ThemedIcon
                        as={X}
                        size={13}
                        className="text-muted-foreground"
                      />
                    </Pressable>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerClassName="flex-row gap-2 pr-4 py-0.5"
                  >
                    {QUICK_REPLIES.map((chip) => (
                      <Pressable
                        key={chip.label}
                        onPress={() => send(chip.value)}
                        accessibilityRole="button"
                        accessibilityLabel={chip.label}
                        className={`flex-row items-center gap-1.5 rounded-full px-4 py-2.5 active:opacity-80 ${
                          chip.primary
                            ? "bg-primary shadow-sm"
                            : "bg-card border border-border shadow-sm"
                        }`}
                        style={chip.primary ? { elevation: 2 } : { elevation: 1 }}
                      >
                        <Text className="font-body font-bold text-xs">
                          {chip.emoji ? `${chip.emoji} ` : ""}
                        </Text>
                        <Text
                          className={`font-body font-bold text-xs ${
                            chip.primary
                              ? "text-primary-foreground"
                              : "text-foreground"
                          }`}
                        >
                          {chip.label}
                        </Text>
                        <ThemedIcon
                          as={chip.icon}
                          size={13}
                          className={
                            chip.primary
                              ? "text-primary-foreground"
                              : "text-muted-foreground"
                          }
                        />
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Feedback */}
              <View className="bg-card border border-border rounded-full px-3 py-2 flex-row items-center gap-1 shadow-sm">
                <Pressable
                  onPress={() =>
                    setFeedback((f) => (f === "helpful" ? null : "helpful"))
                  }
                  accessibilityRole="button"
                  accessibilityLabel="Mark as helpful"
                  className={`flex-row items-center gap-1.5 rounded-full px-2.5 py-1.5 active:opacity-80 ${feedback === "helpful" ? "bg-accent" : ""}`}
                >
                  <ThemedIcon
                    as={ThumbsUp}
                    size={14}
                    className={
                      feedback === "helpful"
                        ? "text-primary"
                        : "text-muted-foreground"
                    }
                  />
                  <Text
                    className={`font-body font-bold text-xs ${feedback === "helpful" ? "text-primary" : "text-muted-foreground"}`}
                  >
                    Helpful
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() =>
                    setFeedback((f) => (f === "confusing" ? null : "confusing"))
                  }
                  accessibilityRole="button"
                  accessibilityLabel="Mark as confusing"
                  className={`flex-row items-center gap-1.5 rounded-full px-2.5 py-1.5 active:opacity-80 ${feedback === "confusing" ? "bg-accent" : ""}`}
                >
                  <ThemedIcon
                    as={ThumbsDown}
                    size={14}
                    className={
                      feedback === "confusing"
                        ? "text-primary"
                        : "text-muted-foreground"
                    }
                  />
                  <Text
                    className={`font-body font-bold text-xs ${feedback === "confusing" ? "text-primary" : "text-muted-foreground"}`}
                  >
                    Confusing
                  </Text>
                </Pressable>
                <View className="flex-1" />
                <Pressable
                  onPress={() => setSaved((s) => !s)}
                  accessibilityRole="button"
                  accessibilityLabel={saved ? "Unsave answer" : "Save answer"}
                  className={`flex-row items-center gap-1 rounded-full px-2.5 py-1.5 active:opacity-80 ${saved ? "bg-primary" : ""}`}
                >
                  <ThemedIcon
                    as={Bookmark}
                    size={14}
                    className={saved ? "text-primary-foreground" : "text-primary"}
                  />
                  <Text
                    className={`font-body font-bold text-xs ${saved ? "text-primary-foreground" : "text-primary"}`}
                  >
                    {saved ? "Saved ✓" : "Save"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Live exchange */}
          {thread.map((msg) =>
            msg.from === "user" ? (
              <View key={msg.id} className="flex-row justify-end">
                <View className="max-w-[85%]">
                  <View className="bg-primary rounded-2xl rounded-br-md px-4 py-3 shadow-sm">
                    <Text className="font-body font-medium text-[14px] text-primary-foreground leading-snug">
                      {msg.text}
                    </Text>
                  </View>
                  <View className="mt-1 flex-row items-center justify-end gap-1">
                    <Text className="font-body text-[11px] text-muted-foreground">
                      {msg.time}
                    </Text>
                    <ThemedIcon
                      as={CheckCheck}
                      size={13}
                      className="text-muted-foreground"
                    />
                  </View>
                </View>
              </View>
            ) : (
              <View key={msg.id} className="flex-row gap-2.5">
                <Image
                  source={{ uri: AVATAR_URI }}
                  className="w-8 h-8 rounded-full shrink-0 border border-border mt-1"
                />
                <View className="flex-1 min-w-0">
                  <View className="bg-card border border-border rounded-2xl rounded-tl-md p-4 shadow-sm">
                    <Text className="font-body font-medium text-[14px] text-foreground leading-snug">
                      {msg.text}
                    </Text>
                  </View>
                  <Text className="mt-1 ml-1 font-body text-[11px] text-muted-foreground">
                    {meta.name} • {msg.time}
                  </Text>
                </View>
              </View>
            ),
          )}

          {/* Typing indicator */}
          {sending && (
            <View className="flex-row gap-2.5 items-end">
              <Image
                source={{ uri: AVATAR_URI }}
                className="w-8 h-8 rounded-full shrink-0 border border-border"
              />
              <View className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3 flex-row items-center gap-3 shadow-sm">
                <TypingDots />
                <Text className="font-body font-medium text-xs text-muted-foreground">
                  {quizPending ? "Making a practice quiz…" : "Typing…"}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* ── Composer ───────────────────────────────────────── */}
        <View
          className="bg-card border-t border-border px-4 pt-2"
          style={{ paddingBottom: Math.max(insets.bottom, 12) }}
        >
          {/* Expandable attach toolbar */}
          {showAttach && (
            <View className="flex-row gap-2 pb-2 pt-1">
              {ATTACH_ACTIONS.map((a) => (
                <Pressable
                  key={a.label}
                  onPress={() => send(a.value)}
                  accessibilityRole="button"
                  accessibilityLabel={`Send ${a.label}`}
                  className="flex-1 bg-muted rounded-xl py-2.5 flex-col items-center justify-center gap-1 active:opacity-80"
                >
                  <ThemedIcon
                    as={a.icon}
                    size={17}
                    className="text-foreground"
                  />
                  <Text className="font-body font-bold text-[11px] text-foreground">
                    {a.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

          <View
            className={`flex-row items-end gap-1 rounded-3xl border bg-background px-1.5 py-1.5 ${
              inputFocused ? "border-primary" : "border-border"
            }`}
            style={{ elevation: 2, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 2 } }}
          >
            <Pressable
              onPress={() => setShowAttach((s) => !s)}
              accessibilityRole="button"
              accessibilityLabel={showAttach ? "Close attachments" : "Open attachments"}
              className={`w-10 h-10 rounded-full items-center justify-center active:opacity-70 ${showAttach ? "bg-primary" : "bg-transparent"}`}
            >
              <ThemedIcon
                as={showAttach ? X : Plus}
                className={showAttach ? "text-primary-foreground" : "text-muted-foreground"}
                size={20}
              />
            </Pressable>

            <TextInput
              value={input}
              onChangeText={setInput}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              onSubmitEditing={() => send(input)}
              placeholder="Ask in English or Myanmar…"
              placeholderTextColor="#8a8474"
              multiline
              blurOnSubmit={false}
              returnKeyType="send"
              maxLength={1000}
              accessibilityLabel="Message input"
              className="flex-1 max-h-28 min-h-10 px-2 py-2.5 font-body text-[14px] text-foreground"
              editable={!sending}
            />

            {!hasInput ? (
              <Pressable
                onPress={() => send("🎤 Voice question")}
                accessibilityRole="button"
                accessibilityLabel="Send voice question"
                className="w-10 h-10 rounded-full bg-muted items-center justify-center active:opacity-70"
              >
                <ThemedIcon
                  as={Mic}
                  className="text-foreground"
                  size={18}
                />
              </Pressable>
            ) : (
              <Pressable
                onPress={() => send(input)}
                disabled={sending}
                accessibilityRole="button"
                accessibilityLabel="Send message"
                className={`w-10 h-10 rounded-full items-center justify-center active:opacity-80 ${sending ? "bg-muted" : "bg-primary"}`}
                style={!sending ? { elevation: 2 } : undefined}
              >
                <ThemedIcon
                  as={SendHorizontal}
                  className={sending ? "text-muted-foreground" : "text-primary-foreground"}
                  size={18}
                />
              </Pressable>
            )}
          </View>

          <Text className="mt-1.5 text-center font-body text-[11px] text-muted-foreground">
            AI tutor can make mistakes — steps ကို သေချာစစ်ပါ ✓
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
