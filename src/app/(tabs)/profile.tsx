import { Text } from "@/components/ui/text";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Profile() {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-pg-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="flex-1 items-center justify-center">
        <Text className="font-heading text-lg">Profile</Text>
        <Text className="text-muted-foreground">Coming soon</Text>
      </View>
    </View>
  );
}
