import { PlusOutlined, ReloadOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Card, Col, Divider, InputNumber, Row, Slider, Space, Table, Typography } from "antd";
import { formatCurrency } from "../../utils/number";
import { useBillCalculator } from "./use-bill-calculator";

const { Title, Text } = Typography;

export const BillCalculatorPage = () => {
  const {
    addPerson,
    calculatedTotal,
    columns,
    finalTotal,
    handleFinalTotalChange,
    handleReset,
    handleSave,
    handleTaxChange,
    handleTipChange,
    people,
    subtotal,
    taxAmount,
    taxPercent,
    tipAmount,
    tipPercent,
  } = useBillCalculator();

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px" }}>
      <Title level={2}>Bill Calculator</Title>
      <Text type="secondary">Split the bill equally by proportion, including tax and tip.</Text>

      <Divider />

      <Card title="People" style={{ marginBottom: 16 }}>
        <Table dataSource={people} columns={columns} pagination={false} rowKey="key" size="middle" />
        <Button type="dashed" onClick={addPerson} icon={<PlusOutlined />} style={{ width: "100%", marginTop: 16 }}>
          Add Person
        </Button>
      </Card>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Card title="Tax & Tip" style={{ marginBottom: 16 }}>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <div>
                  <Text strong>Tax: {taxPercent.toFixed(2)}%</Text>
                  <Slider
                    min={0}
                    max={15}
                    step={0.25}
                    value={taxPercent}
                    onChange={handleTaxChange}
                    tooltip={{ formatter: (value) => `${value}%` }}
                  />
                  <Space.Compact>
                    <InputNumber
                      min={0}
                      max={100}
                      step={0.01}
                      value={taxPercent}
                      onChange={handleTaxChange}
                      style={{ width: "100%" }}
                    />
                    <Space.Addon>%</Space.Addon>
                  </Space.Compact>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <Text strong>Tip: {tipPercent.toFixed(2)}%</Text>
                  <Slider
                    min={0}
                    max={50}
                    step={1}
                    value={tipPercent}
                    onChange={handleTipChange}
                    tooltip={{ formatter: (value) => `${value}%` }}
                  />

                  <Space.Compact>
                    <InputNumber
                      min={0}
                      max={100}
                      step={0.5}
                      value={tipPercent}
                      onChange={handleTipChange}
                      style={{ width: "100%" }}
                    />
                    <Space.Addon>%</Space.Addon>
                  </Space.Compact>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Totals" style={{ marginBottom: 16 }}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text>Subtotal:</Text>
              </Col>
              <Col span={12} style={{ textAlign: "right" }}>
                <Text>{formatCurrency(subtotal)}</Text>
              </Col>

              <Col span={12}>
                <Text>Tax ({taxPercent.toFixed(2)}%):</Text>
              </Col>
              <Col span={12} style={{ textAlign: "right" }}>
                <Text>{formatCurrency(taxAmount)}</Text>
              </Col>

              <Col span={12}>
                <Text>Tip ({tipPercent.toFixed(2)}%):</Text>
              </Col>
              <Col span={12} style={{ textAlign: "right" }}>
                <Text>{formatCurrency(tipAmount)}</Text>
              </Col>

              <Col span={24}>
                <Divider style={{ margin: "8px 0" }} />
              </Col>

              <Col span={12}>
                <Text strong>Final Total:</Text>
              </Col>
              <Col span={12} style={{ textAlign: "right" }}>
                <InputNumber
                  prefix="$"
                  min={0}
                  step={0.01}
                  value={finalTotal ?? calculatedTotal}
                  onChange={handleFinalTotalChange}
                  style={{ width: 150 }}
                />
              </Col>
            </Row>
            <Text type="secondary" style={{ display: "block", marginTop: 8 }}>
              Edit the final total to adjust tip automatically, or adjust tax/tip to calculate the total.
            </Text>
          </Card>
        </Col>
      </Row>

      <Space>
        <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
          Save
        </Button>
        <Button icon={<ReloadOutlined />} onClick={handleReset}>
          Reset
        </Button>
      </Space>
    </div>
  );
};
