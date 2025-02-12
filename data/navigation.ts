import {
  BookOpen,
  BookOpenText,
  Calculator,
  GalleryVerticalEnd,
  HandCoins,
  History,
  House,
  Send,
  Settings2,
  UserRoundCogIcon,
} from "lucide-vue-next";

export interface NavItem {
  title: string;
  name?: string;
  url: string;
  icon?: Component;
  isActive?: boolean;
  items?: NavItem[];
}

export const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/user-icon.png",
  },
  teams: [
    {
      name: "Sista Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      name: "dashboard",
      url: "/dashboard",
      icon: House,
    },
    {
      title: "Payment",
      name: "payment",
      url: "/payment",
      icon: HandCoins,
    },
    {
      title: "Title",
      name: "title",
      url: "/title",
      icon: BookOpenText,
    },
    {
      title: "Guidance",
      name: "guidance",
      url: "/guidance",
      icon: History,
    },
    {
      title: "Users",
      url: "#",
      icon: UserRoundCogIcon,
      // isActive: true,
      items: [
        {
          title: "User",
          url: "/dashboard",
        },
        {
          title: "Create",
          url: "/title/create",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Submissions",
      url: "#",
      icon: Send,
      // isActive: true,
      items: [
        {
          title: "Pre Seminar",
          url: "/pre-seminar",
        },
        {
          title: "Seminars",
          url: "/seminar",
        },
        {
          title: "Exams",
          url: "/exam",
        },
      ],
    },
    {
      title: "Grades",
      url: "#",
      icon: Calculator,
      items: [
        {
          title: "Pre Seminar",
          url: "grades/pre-seminar",
        },
        {
          title: "Seminar",
          url: "grades/seminar",
        },
        {
          title: "Exam",
          url: "grades/exam",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
      ],
    },
  ],
};
