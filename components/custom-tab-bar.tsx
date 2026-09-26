import { Tabs } from "expo-router";
import {
  BookOpenText,
  House,
  UserRound,
  type LucideIcon,
} from "lucide-react-native";
import type { ComponentProps } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedIcon } from "./ui/icon";
import { Text } from "./ui/text";

type CustomTabBarProps = Parameters<
  NonNullable<ComponentProps<typeof Tabs>["tabBar"]>
>[0];

const TAB_ICONS: Record<string, LucideIcon> = {
  index: House,
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
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={focused ? { selected: true } : {}}
      className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-full py-2.5 ${
        focused ? "bg-primary" : ""
      }`}
    >
      <ThemedIcon
        as={icon}
        size={20}
        className={
          focused ? "text-primary-foreground" : "text-muted-foreground"
        }
      />
      {focused ? (
        <Text className="font-heading text-sm text-primary-foreground">
          {label}
        </Text>
      ) : null}
    </Pressable>
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
      className="bg-transparent px-4"
    >
      <View className="flex-row items-center rounded-full border border-border bg-card px-2 py-2 shadow-lg">
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.title ?? route.name;
          const focused = state.index === index;

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
              icon={TAB_ICONS[route.name] ?? House}
              focused={focused}
              onPress={onPress}
            />
          );
        })}
      </View>
    </View>
  );
}
