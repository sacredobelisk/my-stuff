import { CoffeeOutlined, DollarCircleOutlined, HomeOutlined, TableOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { NavLink } from "react-router";

type MenuItem = Required<MenuProps>["items"][number];
type Props = {
  style?: React.CSSProperties;
};

const items: MenuItem[] = [
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
        key: "billCalculator",
        label: <NavLink to="/bill-calculator">Bill Calculator</NavLink>,
      },
      {
        icon: <DollarCircleOutlined />,
        key: "oweMe",
        label: <NavLink to="/owe-me">Owe Me</NavLink>,
      },
    ],
  },
];

export const Nav = ({ style }: Props) => {
  return (
    <nav aria-label="Main navigation" style={style}>
      <Menu defaultSelectedKeys={["home"]} items={items} mode="horizontal" style={{ borderBottom: "none" }} />
    </nav>
  );
};
