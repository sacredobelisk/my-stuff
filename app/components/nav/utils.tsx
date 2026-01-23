import { CoffeeOutlined, DollarCircleOutlined, HomeOutlined, TableOutlined } from "@ant-design/icons";
import { type MenuProps } from "antd";
import { NavLink } from "react-router";

type MenuItem = Required<MenuProps>["items"][number];

export const menuItems: MenuItem[] = [
  {
    icon: <HomeOutlined />,
    key: "home",
    label: (
      <NavLink to="/" end>
        Home
      </NavLink>
    ),
  },
  {
    icon: <CoffeeOutlined />,
    key: "dining",
    label: "Dining Out",
    children: [
      {
        icon: <TableOutlined />,
        key: "bill-calculator",
        label: <NavLink to="/bill-calculator">Bill Calculator</NavLink>,
      },
      {
        icon: <DollarCircleOutlined />,
        key: "owe-me",
        label: <NavLink to="/owe-me">Owe Me</NavLink>,
      },
    ],
  },
];

export const getPathKey = (path: string): [string[], string[]] => {
  const findMatchingItem = (menuItems: MenuItem[], parentKeys: string[] = []): [string[], string[]] | null => {
    for (const item of menuItems) {
      if (!item || typeof item === "string") continue;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const menuItem = item as { key?: string; label?: React.ReactNode; children?: MenuItem[]; [key: string]: any };

      // Check if this item has a NavLink label
      if (menuItem.label && typeof menuItem.label === "object" && "props" in menuItem.label) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const navLinkElement = menuItem.label as any;
        const to = navLinkElement.props?.to;
        const end = navLinkElement.props?.end;

        if (to) {
          // Match exact path if 'end' prop is true, otherwise match prefix
          const matches = end ? path === to : path.startsWith(to) && to !== "/";
          // Special case for home route
          const isHome = end && path === "/" && to === "/";

          if (matches || isHome) {
            return [parentKeys, [menuItem.key as string]];
          }
        }
      }

      // Recursively check children
      if (menuItem.children) {
        const result = findMatchingItem(menuItem.children, [...parentKeys, menuItem.key as string]);
        if (result) return result;
      }
    }

    return null;
  };

  const result = findMatchingItem(menuItems);
  return result || [[], []];
};
