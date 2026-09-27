import {
  Atom,
  BookOpen,
  Calculator,
  Dna,
  FlaskConical,
  Languages,
  type LucideIcon,
} from "lucide-react-native";

export type SubjectId =
  | "maths"
  | "physics"
  | "chemistry"
  | "biology"
  | "english"
  | "myanmar";

export type SubjectMeta = {
  id: SubjectId;
  icon: LucideIcon;
  /** Icon tile background (light + dark). */
  tile: string;
  /** Icon color (light + dark). */
  iconColor: string;
};

/**
 * Single source of truth for subject identity (icon + colors).
 * Both the home Subjects grid and the practice subject list spread from here
 * so a subject always looks the same everywhere.
 */
export const SUBJECT_META: Record<SubjectId, SubjectMeta> = {
  maths: {
    id: "maths",
    icon: Calculator,
    tile: "bg-blue-100 dark:bg-blue-950",
    iconColor: "text-blue-700 dark:text-blue-300",
  },
  physics: {
    id: "physics",
    icon: Atom,
    tile: "bg-purple-100 dark:bg-purple-950",
    iconColor: "text-purple-700 dark:text-purple-300",
  },
  chemistry: {
    id: "chemistry",
    icon: FlaskConical,
    tile: "bg-emerald-100 dark:bg-emerald-950",
    iconColor: "text-emerald-700 dark:text-emerald-300",
  },
  biology: {
    id: "biology",
    icon: Dna,
    tile: "bg-rose-100 dark:bg-rose-950",
    iconColor: "text-rose-700 dark:text-rose-300",
  },
  english: {
    id: "english",
    icon: Languages,
    tile: "bg-amber-100 dark:bg-amber-950",
    iconColor: "text-amber-700 dark:text-amber-300",
  },
  myanmar: {
    id: "myanmar",
    icon: BookOpen,
    tile: "bg-indigo-100 dark:bg-indigo-950",
    iconColor: "text-indigo-700 dark:text-indigo-300",
  },
};
