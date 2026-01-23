import { Menu } from "antd";
import { useLocation } from "react-router";
import { getPathKey, menuItems } from "./utils";

export const Nav = () => {
  const location = useLocation();
  const [openKeys, selectedKeys] = getPathKey(location.pathname);

  return (
    <nav aria-label="Main navigation">
      <Menu defaultOpenKeys={openKeys} defaultSelectedKeys={selectedKeys} items={menuItems} mode="inline" />
    </nav>
  );
};
