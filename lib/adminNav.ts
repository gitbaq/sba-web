/** Shared admin destinations for top Manage menu and left admin sidebar. */

export type AdminNavLink = {
  href: string;
  label: string;
  menuLabel: string;
  description: string;
};

export type AdminNavSection = {
  id: string;
  label: string;
  links: AdminNavLink[];
};

export const ADMIN_NAV_SECTIONS: AdminNavSection[] = [
  {
    id: "site",
    label: "Site",
    links: [
      {
        href: "/admin/home",
        label: "Home",
        menuLabel: "Manage Homepage",
        description: "Boost essays and Start here picks",
      },
      {
        href: "/admin/work",
        label: "Work",
        menuLabel: "Manage Work",
        description: "Add, hide, and prioritize projects",
      },
      {
        href: "/admin/about",
        label: "About",
        menuLabel: "Manage About",
        description: "Photo, bio, and credentials",
      },
    ],
  },
  {
    id: "writing",
    label: "Writing",
    links: [
      {
        href: "/admin/series",
        label: "Series",
        menuLabel: "Manage Series",
        description: "Add, rename, deactivate, or delete series",
      },
      {
        href: "/admin/essays",
        label: "Essays",
        menuLabel: "Manage Essays",
        description: "List essays and open the editor",
      },
    ],
  },
  {
    id: "audience",
    label: "Audience",
    links: [
      {
        href: "/admin/newsletter",
        label: "Newsletter",
        menuLabel: "Manage Newsletter",
        description: "Send or schedule essay emails",
      },
      {
        href: "/admin/subscribers",
        label: "Subscribers",
        menuLabel: "Manage Subscribers",
        description: "List, filter, and manage subscriptions",
      },
      {
        href: "/admin/comments",
        label: "Comments",
        menuLabel: "Moderate Comments",
        description: "Approve or reject reader comments",
      },
    ],
  },
];

export const ADMIN_OVERVIEW_LINK: AdminNavLink = {
  href: "/admin",
  label: "Overview",
  menuLabel: "Admin Overview",
  description: "All admin tools",
};

/** Flat list for active-path checks and overview grids. */
export const ADMIN_MANAGE_LINKS: AdminNavLink[] = [
  ADMIN_OVERVIEW_LINK,
  ...ADMIN_NAV_SECTIONS.flatMap((s) => s.links),
];
