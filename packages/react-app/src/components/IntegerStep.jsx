import { Slider, InputNumber, Row, Col } from "antd";
import React, { useEffect } from "react";

const IntegerStep = ({ val, setVal, max = 10 }) => {
  return (
    <Row>
      <Col span={12}>
        <Slider min={1} max={max} onChange={setVal} value={typeof val === "number" ? val : 0} />
      </Col>
      <Col span={4}>
        <InputNumber min={1} max={max} style={{ margin: "0 16px" }} value={val} onChange={setVal} />
      </Col>
    </Row>
  );
};

export default IntegerStep;
