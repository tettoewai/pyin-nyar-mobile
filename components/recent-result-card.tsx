import type { SubjectMeta } from "@/components/subjects";
import { Box } from "@/components/ui/box";
import { ThemedIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Pressable, View } from "react-native";

export type RecentResult = SubjectMeta & {
  /** Myanmar title, e.g. "သင်္ချာ" */
  title: string;
  /** English title (short form), e.g. "Math" */
  titleEn: string;
  /** e.g. "Today, 4:20 PM" */
  date: string;
  score: number;
  total: number;
  /** e.g. "A" */
  grade: string;
};

type RecentResultCardProps = {
  result: RecentResult;
  onPress?: () => void;
  className?: string;
};

const ROOT_CLASS_NAME =
  "flex flex-row gap-3 w-full bg-card rounded-3xl items-center px-4 py-4";

function gradeStyles(grade: string) {
  return grade.toUpperCase() === "A"
    ? { pill: "bg-primary/10", text: "text-primary" }
    : { pill: "bg-secondary", text: "text-secondary-foreground" };
}

export function RecentResultCard({
  result,
  onPress,
  className,
}: RecentResultCardProps) {
  const {
    icon: Icon,
    tile,
    iconColor,
    title,
    titleEn,
    date,
    score,
    total,
    grade,
  } = result;
  const gradeStyle = gradeStyles(grade);

  const content = (
    <>
      <View
        className={`size-14 shrink-0 flex items-center justify-center rounded-2xl ${tile}`}
      >
        <ThemedIcon as={Icon} className={iconColor} />
      </View>
      <View className="flex-1 min-w-0 gap-0.5">
        <View className="flex flex-row gap-2 items-end flex-1 min-w-0 shrink">
          <Text className="font-heading text-lg" numberOfLines={1}>
            {title}
          </Text>
          <Text
            className="font-body text-sm text-muted-foreground shrink-0"
            numberOfLines={1}
          >
            {titleEn}
          </Text>
        </View>
        <Text
          className="font-body text-sm text-muted-foreground"
          numberOfLines={1}
        >
          {date}
        </Text>
      </View>
      <View className="items-end gap-1 shrink-0">
        <Text className="font-heading text-lg" numberOfLines={1}>
          {score}/{total}
        </Text>
        <Box
          className={`${gradeStyle.pill} rounded-full px-2.5 py-0.5 flex items-center justify-center`}
        >
          <Text className={`font-heading text-sm ${gradeStyle.text}`}>
            {grade}
          </Text>
        </Box>
      </View>
    </>
  );

  const rootClassName = `${ROOT_CLASS_NAME} ${className ?? ""}`.trim();

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${title} ${titleEn} result, ${score} out of ${total}, grade ${grade}`}
        className={`${rootClassName} active:opacity-80`}
      >
        {content}
      </Pressable>
    );
  }

  return <Box className={rootClassName}>{content}</Box>;
}
