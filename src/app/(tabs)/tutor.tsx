import Conversation from "@/components/Conversation";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { ThemedIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import {
  CircleDashed,
  EditIcon,
  Filter,
  SearchIcon,
} from "lucide-react-native";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Tutor() {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-pg-background"
      style={{ paddingTop: insets.top }}
    >
      <ScrollView
        className="flex-1 bg-pg-background"
        contentContainerClassName="px-3 pb-36"
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full flex flex-row justify-between">
        <Box className="w-fit">
          <Text className="font-heading text-2xl">Chats</Text>
          <Text className="font-body text-muted-foreground">
            ဆရာ/ဆရာမများနဲ့ စကားပြောပါ
          </Text>
        </Box>
        <View className="rounded-full p-3.5 bg-primary size-14 flex justify-center items-center">
          <ThemedIcon as={EditIcon} className="text-primary-foreground" />
        </View>
      </View>
      <View className="w-full mt-4">
        <Input className="rounded-2xl px-4 py-2 w-full bg-card border border-border">
          <InputSlot>
            <InputIcon as={SearchIcon} size="lg" />
          </InputSlot>
          <InputField
            className="font-body"
            placeholder="Search teachers or chats..."
          />
          <InputSlot>
            <InputIcon as={Filter} size="lg" />
          </InputSlot>
        </Input>
      </View>
      <ScrollView
        className="mt-2 overflow-x-auto"
        horizontal
        contentContainerClassName="flex flex-row items-center gap-2 px-2 py-2"
      >
        <Button className="rounded-full bg-primary px-4 py-2">
          <Text className="text-primary-foreground">All</Text>
        </Button>
        <Button variant="outline" className="rounded-full px-4 py-2">
          <Text className="text-muted-foreground">Maths</Text>
        </Button>
        <Button variant="outline" className="rounded-full px-4 py-2">
          <Text className="text-muted-foreground">Physics</Text>
        </Button>
        <Button variant="outline" className="rounded-full px-4 py-2">
          <Text className="text-muted-foreground">Chemistry</Text>
        </Button>
        <Button variant="outline" className="rounded-full px-4 py-2">
          <Text className="text-muted-foreground">Biology</Text>
        </Button>
        <Button variant="outline" className="rounded-full px-4 py-2">
          <Text className="text-muted-foreground">English</Text>
        </Button>
        <Button variant="outline" className="rounded-full px-4 py-2">
          <Text className="text-muted-foreground">Myanmar</Text>
        </Button>
      </ScrollView>
      <View className="mt-4">
        <Text className="font-heading text-md text-muted-foreground">
          PINNED • အမြဲမေးနေကျ
        </Text>
      </View>
      <View>
        <Conversation
          id="saya_maung"
          name="Saya Maung"
          avatar={{
            uri: "https://storage.googleapis.com/banani-generated-images/generated-images/25d56666-863f-48f1-8118-82fb9938006f.jpg",
          }}
          verified
          subject="သင်္ချာ · Maths"
          time="4:21 PM"
          unreadCount={2}
          preview="Got it! Let's solve together — အတူတူဖြေကြမယ်"
        />
        <Conversation
          id="sayarma_thida"
          name="Sayarma Thida"
          avatar={{
            uri: "https://storage.googleapis.com/banani-generated-images/generated-images/006dcd7c-e8b9-4c7c-b927-e97c06a5ac83.jpg",
          }}
          verified
          subject="အင်္ဂလိပ် · English"
          time="2:05 PM"
          unreadCount={1}
          preview="Great essay! Fix paragraph 2 — စာပိုဒ် ၂ ပြင်ကြည့် ✍️"
        />
      </View>
      <View>
        <View className="mt-4 flex flex-row items-center justify-between">
          <Text className="font-heading text-muted-foreground text-md">
            ALL TEACHERS • ဘာသာရပ်အလိုက်
          </Text>
          <Text className="text-primary font-heading">6 online</Text>
        </View>
        <Conversation
          id="sayar_aung"
          name="Sayar Aung"
          avatar={{
            uri: "https://storage.googleapis.com/banani-generated-images/generated-images/2f2dac33-071d-4563-bb20-6934f8acad46.jpg",
          }}
          verified
          subject="ရူပဗေဒ · Physics"
          time="11:40 AM"
          preview="Newton's 2nd law diagram sent — ပုံကြည့်ပြီး ပြောပြမယ် ⚛️"
        />
        <Conversation
          id="sayarma_nilar"
          name="Sayarma Nilar"
          avatar={{
            uri: "https://storage.googleapis.com/banani-generated-images/generated-images/25d56666-863f-48f1-8118-82fb9938006f.jpg",
          }}
          verified
          subject="ဓာတု · Chemistry"
          time="Yesterday"
          preview="Acid–base quiz ready — 10 questions, 15 min 🧪"
        />
        <Conversation
          id="sayar_ko"
          name="Sayar Ko"
          avatar={{
            uri: "https://storage.googleapis.com/banani-generated-images/generated-images/186d9dc8-dd33-4a6c-88e9-14a114ce4a38.jpg",
          }}
          verified
          subject="ဇီဝ · Biology"
          time="Yesterday"
          preview="Photosynthesis voice note — နားထောင်ကြည့် 🌱"
        />
        <Conversation
          id="sayarma_hla"
          name="Sayarma Hla"
          avatar={{
            uri: "https://storage.googleapis.com/banani-generated-images/generated-images/25d56666-863f-48f1-8118-82fb9938006f.jpg",
          }}
          verified
          subject="မြန်မာ · Myanmar"
          time="Monday"
          preview="ကဗျာအဓိပ္ပာယ် ရှင်းပြထားတယ် — သိမ်းထားပါ 📖"
        />
      </View>
      <Box className="w-full flex justify-center items-center mt-10">
        <ThemedIcon as={CircleDashed} className="text-accent-foreground" />
        <Text className="text-accent-foreground">The end</Text>
      </Box>
      </ScrollView>
    </View>
  );
}
