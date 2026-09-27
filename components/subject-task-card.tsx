import type { SubjectMeta } from "@/components/subjects";
import { Box } from "@/components/ui/box";
import { ThemedIcon } from "@/components/ui/icon";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { Text } from "@/components/ui/text";
import { ChevronRight, Star } from "lucide-react-native";
import { Pressable, View } from "react-native";

export type SubjectTask = SubjectMeta & {
  /** Myanmar title, e.g. "သင်္ချာ" */
  title: string;
  /** English title (short form), e.g. "Math" */
  titleEn: string;
  done: number;
  totalQuestion: number;
  /** e.g. "Chapter 3" */
  subTitle: string;
};

type SubjectTaskCardProps = {
  task: SubjectTask;
  onPress?: () => void;
  className?: string;
  /** "full" = card with chapter + counts + arrow. "mini" = plain row. */
  variant?: "full" | "mini";
};

const ROOT_CLASS_NAME =
  "flex flex-row gap-3 w-full bg-card rounded-3xl items-center px-4 py-5";

const MINI_ROOT_CLASS_NAME =
  "flex flex-row gap-3 w-full items-center px-4 py-3";

export function SubjectTaskCard({
  task,
  onPress,
  className,
  variant = "full",
}: SubjectTaskCardProps) {
  const {
    icon: Icon,
    tile,
    iconColor,
    title,
    titleEn,
    done,
    totalQuestion,
    subTitle,
  } = task;
  const percent =
    totalQuestion > 0 ? Math.round((done / totalQuestion) * 100) : 0;

  if (variant === "mini") {
    const miniContent = (
      <>
        <View
          className={`size-12 shrink-0 flex items-center justify-center rounded-2xl ${tile}`}
        >
          <ThemedIcon as={Icon} size={20} className={iconColor} />
        </View>
        <View className="flex-1 min-w-0 gap-1.5">
          <View className="flex flex-row items-center justify-between gap-2">
            <View className="flex flex-row gap-1.5 items-baseline flex-1 min-w-0 shrink">
              <Text
                className="font-heading text-[15px] leading-loose"
                numberOfLines={1}
              >
                {title}
              </Text>
              <Text
                className="font-body text-xs text-muted-foreground"
                numberOfLines={1}
              >
                {titleEn}
              </Text>
            </View>
            <Text className="font-heading text-[13px] text-foreground shrink-0">
              {percent}%
            </Text>
          </View>
          <Progress
            value={percent}
            orientation="horizontal"
            accessibilityLabel={`${title} ${titleEn} progress ${percent} percent`}
          >
            <ProgressFilledTrack />
          </Progress>
        </View>
      </>
    );

    const miniRootClassName =
      `${MINI_ROOT_CLASS_NAME} ${className ?? ""}`.trim();

    if (onPress) {
      return (
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={`${title} ${titleEn} practice, ${percent} percent`}
          className={`${miniRootClassName} active:opacity-80`}
        >
          {miniContent}
        </Pressable>
      );
    }

    return <Box className={miniRootClassName}>{miniContent}</Box>;
  }

  const content = (
    <>
      <View
        className={`size-16 shrink-0 flex items-center justify-center rounded-3xl ${tile}`}
      >
        <ThemedIcon as={Icon} className={iconColor} />
      </View>
      <View className="flex-1 min-w-0 gap-2.5">
        <View className="flex flex-row items-center justify-between gap-2">
          <View className="flex flex-row gap-2 items-end flex-1 min-w-0 shrink">
            <Text
              className="font-heading text-lg leading-loose"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="font-body text-sm text-muted-foreground"
              numberOfLines={1}
            >
              {titleEn}
            </Text>
          </View>
          <Box className="bg-primary/10 rounded-full px-1 py-0.5 shrink-0">
            <Text className="text-primary font-heading text-sm leading-loose">
              {subTitle}
            </Text>
          </Box>
        </View>
        <View>
          <Progress value={percent} orientation="horizontal">
            <ProgressFilledTrack />
          </Progress>
        </View>
        <View className="flex flex-row justify-between items-center gap-2">
          <Text
            className="flex-1 font-body text-sm text-muted-foreground"
            numberOfLines={1}
          >
            {done}/{totalQuestion} questions done
          </Text>
          <View className="flex flex-row items-center gap-1 shrink-0">
            <ThemedIcon as={Star} size={14} />
            <Text className="font-body text-sm">{percent}%</Text>
          </View>
        </View>
      </View>
      <View className="shrink-0">
        <ThemedIcon
          as={ChevronRight}
          className="text-muted-foreground size-8"
        />
      </View>
    </>
  );

  const rootClassName = `${ROOT_CLASS_NAME} ${className ?? ""}`.trim();

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${title} ${titleEn} practice`}
        className={`${rootClassName} active:opacity-80`}
      >
        {content}
      </Pressable>
    );
  }

  return <Box className={rootClassName}>{content}</Box>;
}
