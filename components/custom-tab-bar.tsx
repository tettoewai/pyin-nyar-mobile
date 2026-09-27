import { Tabs } from "expo-router";
import {
  BookOpenText,
  House,
  MessageCircle,
  UserRound,
  type LucideIcon,
} from "lucide-react-native";
import type { ComponentProps } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "./ui/button";
import { ThemedIcon } from "./ui/icon";
import { Text } from "./ui/text";

type CustomTabBarProps = Parameters<
  NonNullable<ComponentProps<typeof Tabs>["tabBar"]>
>[0];

const TAB_ICONS: Record<string, LucideIcon> = {
  index: House,
  tutor: MessageCircle,
  practice: BookOpenText,
  profile: UserRound,
};

type TabItemProps = {
  label: string;
  icon: LucideIcon;
  focused: boolean;
  onPress: () => void;
};

function TabItem({ label, icon, focused, onPress }: TabItemProps) {
  return (
    <Button
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={focused ? { selected: true } : {}}
      className={`flex-1 flex-col items-center justify-center gap-1 rounded-full py-2 ${
        focused ? "bg-primary" : "bg-transparent"
      }`}
    >
      <ThemedIcon
        as={icon}
        size={20}
        className={
          focused ? "text-primary-foreground" : "text-muted-foreground"
        }
      />
      <Text
        className={
          focused ? "text-primary-foreground" : "text-muted-foreground"
        }
      >
        {label}
      </Text>
    </Button>
  );
}

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: CustomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ paddingBottom: Math.max(insets.bottom, 12) }}
      className="absolute bottom-2 left-0 right-0 bg-transparent px-4"
    >
      <View className="flex-row items-center rounded-full border border-border bg-card px-2 py-2 shadow-lg">
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.title ?? route.name;
          const focused = state.index === index;
          // Normalize nested routes like `tutor/index` to `tutor` so the
          // icon lookup stays correct even if a tab is a folder route.
          const tabName = route.name.replace(/\/index$/, "");

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TabItem
              key={route.key}
              label={label}
              icon={TAB_ICONS[tabName] ?? House}
              focused={focused}
              onPress={onPress}
            />
          );
        })}
      </View>
    </View>
  );
}
