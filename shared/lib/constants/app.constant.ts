import { Icons } from "@/components/ui/icons";

const kAppName = "Boiler";
const kAppAbbr = "B";
const kAppTagline = "Empowering developers one snippet at a time";
const kAppDescription = `boiler app description`;

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;


export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/d',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'Content Management',
    url: '/d/content',
    icon: 'folderOpen',
    isActive: false,
    items: [
      {
        title: 'Modules',
        url: '/d/modules',
        icon: 'bookOpen'
      },
      {
        title: 'Quizzes',
        url: '/d/quizzes',
        icon: 'helpCircle'
      }
    ]
  },
  {
    title: 'User Management',
    url: '/d/users',
    icon: 'users',
    isActive: false,
    items: [
      {
        title: 'User Progress',
        url: '/d/user-progress',
        icon: 'trendingUp'
      },
      {
        title: 'User Statistics',
        url: '/d/user-stats',
        icon: 'barChart'
      },
      {
        title: 'Achievements',
        url: '/d/achievements',
        icon: 'award'
      }
    ]
  },
  {
    title: 'Community',
    url: '/d/community',
    icon: 'messageSquare',
    isActive: false,
    items: [
      {
        title: 'Forum Categories',
        url: '/d/forum-categories',
        icon: 'folder'
      },
      {
        title: 'Forum Topics',
        url: '/d/forum-topics',
        icon: 'messageCircle'
      },
      {
        title: 'User Messages',
        url: '/d/user-messages',
        icon: 'mail'
      },
      {
        title: 'Reviews',
        url: '/d/reviews',
        icon: 'star'
      }
    ]
  },
  {
    title: 'Engagement',
    url: '/d/engagement',
    icon: 'zap',
    isActive: false,
    items: [
      {
        title: 'Daily Challenges',
        url: '/d/daily-challenges',
        icon: 'calendar'
      },
      {
        title: 'Notifications',
        url: '/d/notifications',
        icon: 'bell'
      }
    ]
  }
];

export { kAppName, kAppAbbr, kAppTagline, kAppDescription };
