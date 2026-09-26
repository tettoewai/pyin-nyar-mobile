import type { LucideIcon, LucideProps } from "lucide-react-native";
import { useResolveClassNames } from "uniwind";

type ThemedIconProps = Omit<LucideProps, "color" | "size" | "className"> & {
  as: LucideIcon;
  /**
   * Tailwind classes resolved at runtime.
   * `text-*` (incl. `dark:text-*`) maps to the icon `color` prop.
   * `size-*` / `w-*` maps to the icon `size` prop.
   */
  className?: string;
  size?: number;
  color?: string;
};

export function ThemedIcon({
  as: IconComponent,
  className,
  size = 24,
  color,
  ...rest
}: ThemedIconProps) {
  const resolved = useResolveClassNames(className ?? "");
  const resolvedColor = (resolved as { color?: string })?.color;
  const resolvedWidth =
    (resolved as { width?: number })?.width ??
    (resolved as { height?: number })?.height;

  return (
    <IconComponent
      size={typeof resolvedWidth === "number" ? resolvedWidth : size}
      color={color ?? resolvedColor}
      {...rest}
    />
  );
}
