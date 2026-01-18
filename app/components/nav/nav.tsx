import { CoffeeOutlined, DollarCircleOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { NavLink } from "react-router";

type MenuItem = Required<MenuProps>["items"][number];
type Props = {
  style?: React.CSSProperties;
};

const items: MenuItem[] = [
  {
    key: "home",
    icon: (
      <NavLink to="/" end>
        Home
      </NavLink>
    ),
  },
  {
    key: "dining",
    label: "Dining Out",
    children: [
      {
        icon: <CoffeeOutlined />,
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
    <nav style={style}>
      <Menu defaultSelectedKeys={["home"]} items={items} mode="horizontal" style={{ borderBottom: "none" }} />
    </nav>
  );
};
