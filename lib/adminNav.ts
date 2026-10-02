/** Shared admin destinations for top Manage menu and left admin sidebar. */
export const ADMIN_MANAGE_LINKS = [
  {
    href: "/admin",
    label: "Overview",
    menuLabel: "Admin overview",
    description: "All admin tools",
  },
  {
    href: "/admin/home",
    label: "Home",
    menuLabel: "Manage homepage",
    description: "Boost essays and Start here picks",
  },
  {
    href: "/admin/essays",
    label: "Essays",
    menuLabel: "Manage essays",
    description: "List essays and open the editor",
  },
  {
    href: "/admin/series",
    label: "Series",
    menuLabel: "Manage series",
    description: "Add, rename, deactivate, or delete series",
  },
  {
    href: "/admin/work",
    label: "Work",
    menuLabel: "Manage work",
    description: "Add, hide, and prioritize projects",
  },
  {
    href: "/admin/about",
    label: "About",
    menuLabel: "Manage about",
    description: "Photo, bio, and credentials",
  },
  {
    href: "/admin/newsletter",
    label: "Newsletter",
    menuLabel: "Manage newsletter",
    description: "Email a published essay to subscribers",
  },
] as const;
