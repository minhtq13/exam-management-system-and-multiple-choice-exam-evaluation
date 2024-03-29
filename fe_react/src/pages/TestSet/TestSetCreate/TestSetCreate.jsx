import "./TestSetCreate.scss";
import { Tabs } from "antd";
import TestSetCreateAuto from "./TestSetCreateAuto";
import { useLocation } from "react-router-dom";
import TestSetCreateManual from "./TestSetCreateManual";
import { getDetailTest } from "../../../utils/storage";
import { useState } from "react";
const TestSetCreate = () => {
  const location = useLocation();
  const testId = location.pathname.split("/")[2];
  const testInfo = getDetailTest();
  const [tabs, setTabs] = useState("auto");
  const items = [
    {
      key: "auto",
      label: <h3>Tự động</h3>,
      children: <TestSetCreateAuto testId={testId} />,
    },
    {
      key: "manual",
      label: <h3>Thủ công</h3>,
      children: (
        <TestSetCreateManual
          testId={testId}
          questionQuantity={testInfo.questionQuantity}
          lstTest={testInfo.lstTestSetCode}
        />
      ),
    },
  ];
  const handleChange = (e) => {
    setTabs(e);
  };
  const renderLevel = () => {
    if (tabs === "auto") {
      if (testInfo.generateConfig) {
        return `(${testInfo.generateConfig?.numEasyQuestion} dễ, 
          ${testInfo.generateConfig?.numMediumQuestion} trung bình, ${testInfo.generateConfig?.numHardQuestion} khó)`
      }
    } else return ""
  }
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
          <span>Thời gian thi:</span>
          <span>{`${testInfo.duration} phút`}</span>
        </div>
      </div>
      <div className="test-create-info">
        <div className="test-create-info-row">
          <span>Số câu hỏi:</span>
          <span>
            {testInfo.questionQuantity}{" "}
            {renderLevel()}
          </span>
        </div>
        <div className="test-create-info-row">
          <span>Bộ đề:</span>
          <span>
            {testInfo.lstTestSetCode ? testInfo.lstTestSetCode.split(",").join(", ") : ""}
          </span>
        </div>
      </div>
      <Tabs
        defaultActiveKey="1"
        items={items}
        className="test-content"
        onChange={handleChange}
      ></Tabs>
    </div>
  );
};
export default TestSetCreate;
