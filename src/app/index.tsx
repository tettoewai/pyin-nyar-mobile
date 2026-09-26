import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Flame, Gem, SendHorizonal } from "lucide-react-native";
import { View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 bg-pg-background">
      <View className="w-full mt-10 px-4 py-2 flex flex-row justify-between">
        <View className="flex flex-row">
          <Avatar className="bg-primary">
            <AvatarFallbackText className="text-primary-foreground">
              Thiri
            </AvatarFallbackText>
            <AvatarImage source={{}} />
          </Avatar>
          <View className="ml-2">
            <Text size="md" className="font-headings">
              Mingalarbar, Thiri!
            </Text>
            <Text className="text-accent-foreground">Grade 12, Yangon</Text>
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

      <Card className="rounded-4xl m-3 bg-primary">
        <View className="flex-row w-full">
          <Avatar className="mr-4 size-20">
            <AvatarFallbackText>MT</AvatarFallbackText>
            <AvatarBadge />
            <AvatarImage source={{}} />
          </Avatar>
          <Box className="flex flex-col justify-center items-start">
            <Heading
              size="md"
              className="mb-1 font-headings text-primary-foreground"
            >
              Sayarma May Thu
            </Heading>
            <Text size="sm" className="font-body text-primary-foreground">
              Your AI teacher
            </Text>
            <Text className="text-primary-foreground">
              Ask me anything, anytime
            </Text>
          </Box>
        </View>

        <Box className="w-full rounded-full bg-primary-foreground flex flex-row p-1 mt-4 items-center justify-between">
          <Box className="flex-1 px-4 py-3">
            <Text>Ask anything...</Text>
          </Box>
          <View className="rounded-full p-3.5 bg-primary">
            <SendHorizonal color="white" />
          </View>
        </Box>
      </Card>
    </View>
  );
}
