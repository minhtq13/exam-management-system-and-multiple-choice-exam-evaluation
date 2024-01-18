
import { useState } from "react";
import "./TestSetCreate.scss";
import { Tabs } from "antd";
import TestSetCreateAuto from "./TestSetCreateAuto";
import { useLocation } from "react-router-dom";
import TestSetCreateManual from "./TestSetCreateManual";
import { getDetailTest } from "../../../utils/storage";
const TestSetCreate = () => {
  const [tabKey, setTabKey] = useState("auto");
  const location = useLocation();
  const testId = location.pathname.split("/")[2];
  const items = [
    {
      key: "auto",
      label: <h3>Tự động</h3>,
      children: <TestSetCreateAuto testId={testId} />
    },
    {
      key: "manual",
      label: <h3>Thủ công</h3>,
      children: <TestSetCreateManual testId={testId} />
    },
  ]
  const testInfo = getDetailTest();
  const tabOnchange = (value) => {
    setTabKey(value);
  };

  return (
    <div className="test-set-create">
      <div className="test-set-header">Tạo bộ đề thi</div>
      <div className="test-create-info">
        <div className="test-create-info-row">
          <span>Học phần:</span>
          <span>{testInfo.subjectName}</span>
        </div>
        <div className="test-create-info-row">
          <span>Học kỳ:</span>
          <span>{testInfo.semester}</span>
        </div>
        <div className="test-create-info-row">
          <span>Số câu hỏi:</span>
          <span>{testInfo.questionQuantity}</span>
        </div>
        <div className="test-create-info-row">
          <span>Thời gian thi:</span>
          <span>{`${testInfo.duration} phút`}</span>
        </div>
        <span></span>
      </div>
      <Tabs
        onChange={tabOnchange}
        defaultActiveKey="1"
        items={items}
        className="test-content"
      ></Tabs>
    </div>
  )
}
export default TestSetCreate;
