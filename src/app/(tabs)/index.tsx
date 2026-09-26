import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Grid, GridItem } from "@/components/ui/grid";
import { ThemedIcon } from "@/components/ui/icon";
import { Link, LinkText } from "@/components/ui/link";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { Text } from "@/components/ui/text";

import {
  Activity,
  ArrowRight,
  Atom,
  Book,
  BookOpen,
  Calculator,
  CaseSensitive,
  Flame,
  FlaskConical,
  Gem,
  Languages,
  Play,
  SendHorizonal,
} from "lucide-react-native";
import { ScrollView, View } from "react-native";

export default function Index() {
  const subjects = [
    {
      title: "သင်္ချာ",
      titleEn: "Maths",
      icon: Calculator,
      lessons: 42,
      color: "bg-blue-200",
    },
    {
      title: "ရူပဗေဒ",
      titleEn: "Physics",
      icon: Atom,
      lessons: 28,
      color: "bg-purple-200",
    },
    {
      title: "ဓာတု",
      titleEn: "Chemistry",
      icon: FlaskConical,
      lessons: 31,
      color: "bg-emerald-200",
    },
    {
      title: "အင်္ဂလိပ်",
      titleEn: "English",
      icon: CaseSensitive,
      lessons: 56,
      color: "bg-amber-200",
    },
    {
      title: "ဇီဝ",
      titleEn: "Biology",
      icon: Activity,
      lessons: 19,
      color: "bg-rose-200",
    },
    {
      title: "မြန်မာ",
      titleEn: "Myanmar",
      icon: BookOpen,
      lessons: 24,
      color: "bg-indigo-200",
    },
  ];

  const avatars = [
    {
      src: "https://example.com.jpg",
      alt: "Sandeep Srivastva",
      color: "bg-emerald-600",
    },
    {
      src: "https://example.com.jpg",
      alt: "Arjun Kapoor",
      color: "bg-cyan-600",
    },
    {
      src: "https://example.com.jpg",
      alt: "Ritik Sharma ",
      color: "bg-indigo-600",
    },
    {
      src: "https://example.com.jpg",
      alt: "Akhil Sharma",
      color: "bg-gray-600",
    },
    {
      src: "https://example.com.jpg",
      alt: "Rahul Sharma ",
      color: "bg-red-400",
    },
  ];

  return (
    <ScrollView
      className="flex-1 bg-pg-background"
      contentContainerClassName="px-3 pb-32"
      showsVerticalScrollIndicator={false}
    >
      <View className="w-full mt-10 py-2 flex flex-row justify-between">
        <View className="flex flex-row">
          <Avatar className="bg-primary">
            <AvatarFallbackText className="text-primary-foreground">
              Thiri
            </AvatarFallbackText>
            <AvatarImage source={{}} />
          </Avatar>
          <View className="ml-2">
            <Text size="md" className="font-heading">
              Mingalarbar, Thiri!
            </Text>
            <Text className="text-muted-foreground">Grade 12 • Yangon</Text>
          </View>
        </View>
        <View className="flex flex-row gap-1">
          <Button variant="outline" className="rounded-full" size="sm">
            <ButtonIcon as={Flame} size="icon" className="text-red-500" />
            <ButtonText className="font-bold" size="lg">
              12
            </ButtonText>
          </Button>
          <Button variant="outline" className="rounded-full" size="sm">
            <ButtonIcon as={Gem} size="icon" className="text-blue-500" />
            <ButtonText className="font-bold" size="lg">
              240
            </ButtonText>
          </Button>
        </View>
      </View>

      <Card className="rounded-4xl bg-primary overflow-hidden mt-5">
        <View className="flex-row w-full">
          <Avatar className="mr-4 size-20">
            <AvatarFallbackText>MT</AvatarFallbackText>
            <AvatarBadge className="size-5" />
            <AvatarImage source={{}} />
          </Avatar>
          <Box className="flex flex-col justify-center items-start">
            <Text size="md" className="font-heading text-primary-foreground">
              Sayarma May Thu
            </Text>
            <Text size="sm" className="font-body text-primary-foreground">
              Your AI teacher
            </Text>
            <Text className="text-primary-foreground">
              Ask me anything, anytime
            </Text>
          </Box>
        </View>

        <Box className="w-full rounded-full bg-card flex flex-row p-1 items-center justify-between border border-border-">
          <Box className="flex-1 px-4 py-3">
            <Text>Ask anything...</Text>
          </Box>
          <View className="rounded-full p-3.5 bg-primary">
            <ThemedIcon
              as={SendHorizonal}
              className="text-primary-foreground"
            />
          </View>
        </Box>
        <Box className="w-full flex flex-row justify-between items-center gap-2">
          <Box className="flex items-center justify-center bg-primary-foreground/10 border border-primary-foreground/20 px-3 py-1 rounded-full w-fit ">
            <Text className="text-primary-foreground text-sm">
              မင်္ဂလာပါ ဆရာမ
            </Text>
          </Box>
          <Box className="flex flex-row items-center justify-center bg-primary-foreground/10 border border-primary-foreground/20 px-3 py-1 rounded-full w-fit">
            <Text className="text-primary-foreground">
              ဒီနေ့ ဘာသင်မှာလဲမသိဘူး
            </Text>
          </Box>
        </Box>
        <View className="bg-[#5d854b]/70 absolute -top-20 -right-16 rounded-full size-60 -z-10" />
        <View className="bg-white/10 absolute -bottom-26 left-16 rounded-full size-40 -z-10" />
      </Card>

      <Box className="bg-card rounded-2xl w-full mt-3 p-4 flex">
        <Box className="flex items-center justify-between flex-row w-full">
          <Box className="flex flex-row gap-3 items-center justify-center">
            <Box className="flex items-center justify-center bg-primary size-10 rounded-md">
              <ThemedIcon as={Play} className="text-primary-foreground" />
            </Box>
            <Box>
              <Text className="text-primary font-mono">
                CONTINUE • Grade 12 Maths
              </Text>
              <Text className="font-heading">Quadratic Quations --- Ch.3</Text>
            </Box>
          </Box>
          <Box>
            <Text className="text-primary font-bold text-xl">68%</Text>
          </Box>
        </Box>
        <Box className="mt-4">
          <Progress value={68} orientation="horizontal" className="h-4">
            <ProgressFilledTrack />
          </Progress>
        </Box>
        <Box className="flex flex-row justify-between items-center mt-2">
          <Text>Lesson 8 of 12 • 15 left</Text>
          <Button className="bg-primary rounded-full py-4 px-6">
            <ButtonText>Resume</ButtonText>
          </Button>
        </Box>
      </Box>
      <Box className="bg-secondary/80 rounded-2xl px-4 py-3 flex items-center flex-row justify-between mt-3 w-full">
        <Box className="size-16 bg-background rounded-2xl flex items-center justify-center">
          <ThemedIcon as={Book} className="size-10" />
        </Box>
        <Box className="w-1/2">
          <Text className="font-heading text-lg mt-2 text-secondary-foreground">
            Matric Exam • 142 days left
          </Text>
          <Text className="font-body text-sm mt-2 line-clamp-2 text-secondary-foreground">
            Daily mock test ready --- 20 questions
          </Text>
        </Box>
        <Button className="bg-secondary-foreground rounded-full py-4 px-6">
          <ButtonText>Start</ButtonText>
        </Button>
      </Box>
      <Box className="mt-4 w-full">
        <Box className="w-full flex justify-between items-center flex-row">
          <Text className="font-heading text-lg">
            Today's pratice • လေးကျင့်ခန်း
          </Text>
          <Link>
            <LinkText>History</LinkText>
          </Link>
        </Box>
        <Box>
          <Box className="w-full bg-white rounded-xl p-4 flex flex-row justify-between items-center mt-3 gap-2 border border-border">
            <Box className="rounded-2xl bg-primary size-15 flex items-center justify-center">
              <ThemedIcon as={Calculator} className="text-primary-foreground" />
            </Box>
            <Box className="w-5/8">
              <Text className="font-heading text-lg line-clamp-2">
                5 Maths problems fixed for you
              </Text>
              <Text className="font-body line-clamp-2">
                Based on yesterdays' mistakes • 10 min
              </Text>
            </Box>
            <Button size="icon" className="rounded-full p-3.5">
              <ButtonIcon as={ArrowRight} />
            </Button>
          </Box>
          <Box className="w-full bg-white rounded-xl p-4 flex flex-row justify-between items-center mt-3 gap-2 border border-border">
            <Box className="rounded-2xl bg-primary size-15 flex items-center justify-center bord">
              <ThemedIcon as={Languages} className="text-primary-foreground" />
            </Box>
            <Box className="w-5/8">
              <Text className="font-heading text-lg line-clamp-2">
                English speaking: Market dialogue
              </Text>
              <Text className="font-body line-clamp-2">
                Practice with voice • 15m
              </Text>
            </Box>
            <Button size="icon" className="rounded-full p-3.5">
              <ButtonIcon as={ArrowRight} />
            </Button>
          </Box>
        </Box>
      </Box>

      <Box className="mt-4 w-full">
        <Box className="flex flex-row justify-between">
          <Text className="font-heading text-lg">Subjects • ဘာသာရပ်များ</Text>
          <Link>
            <LinkText>See all</LinkText>
          </Link>
        </Box>
        <Box className="w-full mt-2">
          <Grid className="gap-2" _extra={{ className: "grid-cols-3" }}>
            {subjects.map((item) => (
              <GridItem
                key={item.title}
                className="bg-background border border-border rounded-2xl p-3"
                _extra={{ className: "" }}
              >
                <Box
                  className={`${item.color} size-15 rounded-xl flex items-center justify-center mb-2`}
                >
                  <ThemedIcon as={item.icon} />
                </Box>
                <Text className="font-heading text-lg">{item.title}</Text>
                <Text className="font-body text-sm text-muted-foreground">
                  {item.titleEn}
                </Text>
                <Text className="font-body text-muted-foreground mt-4 text-center">
                  {item.lessons} lessons
                </Text>
              </GridItem>
            ))}
          </Grid>
        </Box>
        <Box className="bg-card rounded-2xl flex flex-row p-4 justify-between mt-4">
          <AvatarGroup>
            {avatars.slice(0, 3).map((avatar, index) => (
              <Avatar
                size="sm"
                key={index}
                className={
                  "border-2 border-background " +
                  avatar.color +
                  (index > 0 ? " -ml-3" : "") // negative left margin to overlap
                }
              >
                <AvatarFallbackText className="text-white">
                  {avatar.alt}
                </AvatarFallbackText>
              </Avatar>
            ))}
          </AvatarGroup>
          <Text className="line-clamp-2 w-4/7 text-sm text-muted-foreground">
            2,400+ students from Yangon & Mandalay studied today
          </Text>
          <Button variant="ghost">
            <ButtonText className="text-primary">Join</ButtonText>
          </Button>
        </Box>
      </Box>
    </ScrollView>
  );
}
