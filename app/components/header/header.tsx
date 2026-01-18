import { Layout, Typography } from "antd";
import { Nav } from "../nav/nav";

const { Header: AntHeader } = Layout;
const { Title } = Typography;

export const Header = () => (
  <AntHeader style={{ alignItems: "center", display: "flex", width: "100%" }}>
    <Title>Sean OBrien</Title>
    <Nav style={{ flex: "auto" }} />
  </AntHeader>
);
