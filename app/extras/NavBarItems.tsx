import {
  BlocksIcon,
  BoxesIcon,
  CircleUserRound,
  FilesIcon,
  GraduationCapIcon,
  Grid2X2Icon,
  HomeIcon,
  LayoutListIcon,
  LibraryBigIcon,
  LucideIcon,
  NotebookPenIcon,
  SlidersHorizontalIcon,
  TicketIcon,
  UsersIcon,
} from "lucide-react";

export interface VerticalNavBarItem {
  route: string;
  title: string;
  icon: LucideIcon;
  key: string;
  isOpen: boolean;
  subRoutes?: VerticalNavBarItem[];
}

export const navBarItems: VerticalNavBarItem[] = [
  {
    route: "/teacher",
    title: "Home",
    key: "teacher",
    icon: HomeIcon,
    isOpen: false,
  },
  {
    route: "/teacher/courses",
    title: "Courses",
    icon: LibraryBigIcon,
    key: "courses",
    isOpen: false,
  },
  {
    route: "/teacher/batches",
    title: "Batches",
    icon: Grid2X2Icon,
    key: "batches",
    isOpen: false,
  },
  {
    route: "/teacher/assignments",
    title: "Assigmnents",
    icon: NotebookPenIcon,
    key: "assignments",
    isOpen: false,
  },
  {
    route: "/teacher/events",
    title: "Events",
    icon: TicketIcon,
    key: "events",
    isOpen: false,
  },
];
