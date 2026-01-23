import { Col, Layout, Row, Typography } from "antd";
import { Nav } from "../nav/nav";

const { Header: AntHeader } = Layout;
const { Title } = Typography;

export const Header = () => (
  <AntHeader>
    <Row align="middle" gutter={16} wrap={false}>
      <Col flex="none">
        <Title>Sean OBrien</Title>
      </Col>
      <Col flex="auto">
        <Nav />
      </Col>
    </Row>
  </AntHeader>
);
