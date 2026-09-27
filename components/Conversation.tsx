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
import { Pressable, type ImageSourcePropType } from "react-native";

const ROOT_CLASS_NAME =
  "w-full flex flex-row items-center gap-3 mt-2 px-3 py-4 rounded-2xl bg-card";

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
  className,
  ...props
}: ConversationProps) {
  const rootClassName = `${ROOT_CLASS_NAME} ${className ?? ""}`.trim();

  const content = (
    <>
      <Avatar size="lg" className="bg-primary">
        <AvatarFallbackText className="text-primary-foreground">
          {initials ?? getInitials(name)}
        </AvatarFallbackText>
        {avatar ? <AvatarImage source={avatar} /> : null}
      </Avatar>

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
            <Text className="text-xs text-muted-foreground shrink-0 ml-2">
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
        {preview || unreadCount > 0 ? (
          <Box className="w-full flex flex-row items-center gap-2">
            {preview ? (
              <Text
                className="font-body text-muted-foreground flex-1 min-w-0 text-sm"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {preview}
              </Text>
            ) : null}
            {unreadCount > 0 ? (
              <Box className="size-7 rounded-full bg-secondary items-center justify-center shrink-0">
                <Text className="text-secondary-foreground font-heading text-xs">
                  {unreadCount}
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
