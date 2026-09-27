import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { ThemedIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { CheckCheck, Verified } from "lucide-react-native";
import { Link } from "expo-router";
import type { ComponentProps } from "react";
import { Pressable, View, type ImageSourcePropType } from "react-native";

const ROOT_CLASS_NAME =
  "w-full flex flex-row items-center gap-3 mt-2 px-3 py-3.5 rounded-2xl bg-card border border-border";

export type ConversationProps = {
  /** Teacher id. When omitted the row renders as a non-pressable `Box`. */
  id?: string;
  /** Contact display name. */
  name: string;
  /** Remote image. Falls back to initials when omitted. */
  avatar?: ImageSourcePropType;
  /** Overrides the initials derived from `name`. */
  initials?: string;
  /** Shows the verified badge next to the name. */
  verified?: boolean;
  /** Subject tag. Hidden when omitted. */
  subject?: string;
  /** Latest message preview. Hidden when omitted. */
  preview?: string;
  /** Right-aligned timestamp. Hidden when omitted. */
  time?: string;
  /** Unread count. Badge is hidden when `0` or omitted. */
  unreadCount?: number;
  /** Green presence dot on the avatar. */
  online?: boolean;
  /** Renders the row as a pressable and forwards the handler. */
  onPress?: () => void;
} & Omit<ComponentProps<typeof Box>, "children" | "ref">;

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export default function Conversation({
  id,
  name,
  avatar,
  initials,
  verified = false,
  subject,
  preview,
  time,
  unreadCount = 0,
  online = false,
  className,
  ...props
}: ConversationProps) {
  const rootClassName = `${ROOT_CLASS_NAME} ${className ?? ""}`.trim();
  const hasUnread = unreadCount > 0;

  const content = (
    <>
      <View className="relative shrink-0">
        <Avatar size="lg" className="bg-primary">
          <AvatarFallbackText className="text-primary-foreground">
            {initials ?? getInitials(name)}
          </AvatarFallbackText>
          {avatar ? <AvatarImage source={avatar} /> : null}
        </Avatar>
        {online ? (
          <View
            className="absolute right-0 bottom-0 size-3.5 rounded-full bg-primary border-2 border-card"
            accessibilityLabel="Online"
          />
        ) : null}
      </View>

      <Box className="flex flex-col gap-1 flex-1 min-w-0">
        {/* Header row: name + verified + time */}
        <Box className="flex flex-row items-center justify-between w-full">
          <Box className="flex flex-row items-center gap-2 flex-1 min-w-0">
            <Text className="font-heading" numberOfLines={1}>
              {name}
            </Text>
            {verified ? (
              <ThemedIcon as={Verified} size={16} className="text-primary" />
            ) : null}
          </Box>
          {time ? (
            <Text
              className={`text-xs shrink-0 ml-2 font-body ${hasUnread ? "text-primary font-bold" : "text-muted-foreground"}`}
            >
              {time}
            </Text>
          ) : null}
        </Box>

        {/* Subject tag */}
        {subject ? (
          <Box className="bg-secondary self-start rounded-full px-3 py-1">
            <Text className="font-body text-secondary-foreground text-xs">
              {subject}
            </Text>
          </Box>
        ) : null}

        {/* Preview + unread badge */}
        {preview || hasUnread ? (
          <Box className="w-full flex flex-row items-center gap-2">
            {preview ? (
              <Text
                className={`font-body flex-1 min-w-0 text-sm ${hasUnread ? "text-foreground font-bold" : "text-muted-foreground"}`}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {preview}
              </Text>
            ) : null}
            {hasUnread ? (
              <Box className="min-w-7 h-7 px-1.5 rounded-full bg-primary items-center justify-center shrink-0">
                <Text className="text-primary-foreground font-heading text-xs">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Text>
              </Box>
            ) : (
              <ThemedIcon as={CheckCheck} className="text-primary size-5" />
            )}
          </Box>
        ) : null}
      </Box>
    </>
  );

  if (id) {
    return (
      <Link href={`/tutor/${id}`} asChild>
        <Pressable
          className={rootClassName}
          accessibilityRole="button"
          {...props}
        >
          {content}
        </Pressable>
      </Link>
    );
  }

  return (
    <Box className={rootClassName} {...props}>
      {content}
    </Box>
  );
}
