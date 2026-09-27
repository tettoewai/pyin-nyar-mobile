import Conversation from "@/components/Conversation";
import { Box } from "@/components/ui/box";
import { ThemedIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import {
  CircleCheck,
  PenLine,
  SearchIcon,
  SearchX,
  SlidersHorizontal,
  X,
} from "lucide-react-native";
import { useMemo, useRef, useState } from "react";
import { Pressable, RefreshControl, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Teacher = {
  id: string;
  name: string;
  avatar: { uri: string };
  subject: string;
  filter: string;
  time: string;
  preview: string;
  unreadCount?: number;
  online?: boolean;
  pinned?: boolean;
};

const TEACHERS: Teacher[] = [
  {
    id: "saya_maung",
    name: "Saya Maung",
    avatar: {
      uri: "https://storage.googleapis.com/banani-generated-images/generated-images/25d56666-863f-48f1-8118-82fb9938006f.jpg",
    },
    subject: "သင်္ချာ · Maths",
    filter: "Maths",
    time: "4:21 PM",
    unreadCount: 2,
    online: true,
    pinned: true,
    preview: "Got it! Let's solve together — အတူတူဖြေကြမယ်",
  },
  {
    id: "sayarma_thida",
    name: "Sayarma Thida",
    avatar: {
      uri: "https://storage.googleapis.com/banani-generated-images/generated-images/006dcd7c-e8b9-4c7c-b927-e97c06a5ac83.jpg",
    },
    subject: "အင်္ဂလိပ် · English",
    filter: "English",
    time: "2:05 PM",
    unreadCount: 1,
    online: true,
    pinned: true,
    preview: "Great essay! Fix paragraph 2 — စာပိုဒ် ၂ ပြင်ကြည့် ✍️",
  },
  {
    id: "sayar_aung",
    name: "Sayar Aung",
    avatar: {
      uri: "https://storage.googleapis.com/banani-generated-images/generated-images/2f2dac33-071d-4563-bb20-6934f8acad46.jpg",
    },
    subject: "ရူပဗေဒ · Physics",
    filter: "Physics",
    time: "11:40 AM",
    online: true,
    preview: "Newton's 2nd law diagram sent — ပုံကြည့်ပြီး ပြောပြမယ် ⚛️",
  },
  {
    id: "sayarma_nilar",
    name: "Sayarma Nilar",
    avatar: {
      uri: "https://storage.googleapis.com/banani-generated-images/generated-images/25d56666-863f-48f1-8118-82fb9938006f.jpg",
    },
    subject: "ဓာတု · Chemistry",
    filter: "Chemistry",
    time: "Yesterday",
    online: true,
    preview: "Acid–base quiz ready — 10 questions, 15 min 🧪",
  },
  {
    id: "sayar_ko",
    name: "Sayar Ko",
    avatar: {
      uri: "https://storage.googleapis.com/banani-generated-images/generated-images/186d9dc8-dd33-4a6c-88e9-14a114ce4a38.jpg",
    },
    subject: "ဇီဝ · Biology",
    filter: "Biology",
    time: "Yesterday",
    online: false,
    preview: "Photosynthesis voice note — နားထောင်ကြည့် 🌱",
  },
  {
    id: "sayarma_hla",
    name: "Sayarma Hla",
    avatar: {
      uri: "https://storage.googleapis.com/banani-generated-images/generated-images/25d56666-863f-48f1-8118-82fb9938006f.jpg",
    },
    subject: "မြန်မာ · Myanmar",
    filter: "Myanmar",
    time: "Monday",
    online: true,
    preview: "ကဗျာအဓိပ္ပာယ် ရှင်းပြထားတယ် — သိမ်းထားပါ 📖",
  },
];

const FILTERS = [
  "All",
  "Maths",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Myanmar",
];

export function SectionLabel({
  title,
  right,
}: {
  title: string;
  right?: string;
}) {
  return (
    <View className="mt-5 flex flex-row items-center justify-between">
      <Text className="font-heading text-[12px] tracking-widest text-muted-foreground leading-loose">
        {title}
      </Text>
      {right ? (
        <Text className="text-primary font-heading text-[13px]">{right}</Text>
      ) : null}
    </View>
  );
}

export default function Tutor() {
  const insets = useSafeAreaInsets();
  const searchRef = useRef<any>(null);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [refreshing, setRefreshing] = useState(false);

  const matches = (t: Teacher) => {
    if (activeFilter !== "All" && t.filter !== activeFilter) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      t.name.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q) ||
      t.preview.toLowerCase().includes(q)
    );
  };

  const pinned = useMemo(
    () => TEACHERS.filter((t) => t.pinned && matches(t)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query, activeFilter],
  );
  const rest = useMemo(
    () => TEACHERS.filter((t) => !t.pinned && matches(t)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query, activeFilter],
  );
  const onlineCount = useMemo(
    () => TEACHERS.filter((t) => t.online).length,
    [],
  );
  const totalUnread = useMemo(
    () => TEACHERS.reduce((n, t) => n + (t.unreadCount ?? 0), 0),
    [],
  );
  const isFiltering = query.trim().length > 0 || activeFilter !== "All";

  const renderRow = (t: Teacher) => (
    <Conversation
      key={t.id}
      id={t.id}
      name={t.name}
      avatar={t.avatar}
      verified
      subject={t.subject}
      time={t.time}
      unreadCount={t.unreadCount}
      online={t.online}
      preview={t.preview}
    />
  );

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
                Chats
              </Text>
              {totalUnread > 0 ? (
                <Box className="min-w-7 h-7 px-1.5 rounded-full bg-primary items-center justify-center">
                  <Text className="text-primary-foreground font-heading text-xs">
                    {totalUnread}
                  </Text>
                </Box>
              ) : null}
            </View>
            <Text className="font-body text-[13px] text-muted-foreground mt-0.5 leading-loose">
              ဆရာ/ဆရာမများနဲ့ စကားပြောပါ
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
              as={PenLine}
              size={20}
              className="text-primary-foreground"
            />
          </Pressable>
        </View>

        {/* ── Search ─────────────────────────────────────── */}
        <View className="w-full mt-3.5 flex-row items-center gap-2">
          <Input className="rounded-2xl flex-1 bg-card border border-border h-full">
            <InputSlot className="pl-3">
              <InputIcon as={SearchIcon} />
            </InputSlot>
            <InputField
              ref={searchRef}
              value={query}
              onChangeText={setQuery}
              placeholder="Search teachers or chats…"
              returnKeyType="search"
              accessibilityLabel="Search teachers or chats"
              className="font-body"
            />
            {query.length > 0 ? (
              <InputSlot className="pr-2">
                <Pressable
                  onPress={() => setQuery("")}
                  accessibilityRole="button"
                  accessibilityLabel="Clear search"
                  className="w-7 h-7 rounded-full bg-muted items-center justify-center active:opacity-70"
                >
                  <ThemedIcon
                    as={X}
                    size={14}
                    className="text-muted-foreground"
                  />
                </Pressable>
              </InputSlot>
            ) : null}
          </Input>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Filter options"
            className="w-12 h-12 rounded-2xl bg-card border border-border items-center justify-center active:opacity-70 shrink-0"
          >
            <ThemedIcon
              as={SlidersHorizontal}
              size={18}
              className="text-muted-foreground"
            />
          </Pressable>
        </View>

        {/* ── Subject filter chips ───────────────────────── */}
        <ScrollView
          className="mt-2.5 -mx-4"
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="flex flex-row items-center gap-2 px-4 py-1"
        >
          {FILTERS.map((f) => {
            const selected = f === activeFilter;
            return (
              <Pressable
                key={f}
                onPress={() => setActiveFilter(f)}
                accessibilityRole="button"
                accessibilityLabel={`Filter by ${f}`}
                accessibilityState={{ selected }}
                className={`rounded-full px-4 py-2.5 active:opacity-80 ${
                  selected ? "bg-primary" : "bg-card border border-border"
                }`}
              >
                <Text
                  className={`font-body font-bold text-[13px] ${
                    selected
                      ? "text-primary-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {f}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* ── Results ────────────────────────────────────── */}
        {pinned.length === 0 && rest.length === 0 ? (
          <View className="items-center mt-14 px-8">
            <View className="w-16 h-16 rounded-full bg-muted items-center justify-center">
              <ThemedIcon
                as={SearchX}
                size={26}
                className="text-muted-foreground"
              />
            </View>
            <Text className="font-heading text-[16px] text-foreground mt-3 text-center">
              No teachers found
            </Text>
            <Text className="font-body text-[13px] text-muted-foreground mt-1 text-center">
              Try a different name, subject, or clear your filters.
            </Text>
            <Pressable
              onPress={() => {
                setQuery("");
                setActiveFilter("All");
              }}
              accessibilityRole="button"
              accessibilityLabel="Clear search and filters"
              className="mt-4 rounded-full bg-primary px-5 py-2.5 active:opacity-80"
            >
              <Text className="font-heading text-[13px] text-primary-foreground">
                Clear all
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            {pinned.length > 0 ? (
              <>
                <SectionLabel title="PINNED • အမြဲမေးနေကျ" />
                <View>{pinned.map(renderRow)}</View>
              </>
            ) : null}

            {rest.length > 0 ? (
              <>
                <SectionLabel
                  title={
                    isFiltering
                      ? "RESULTS • ရလဒ်များ"
                      : "ALL TEACHERS • ဘာသာရပ်အလိုက်"
                  }
                  right={`${onlineCount} online`}
                />
                <View>{rest.map(renderRow)}</View>
              </>
            ) : null}
          </>
        )}

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
