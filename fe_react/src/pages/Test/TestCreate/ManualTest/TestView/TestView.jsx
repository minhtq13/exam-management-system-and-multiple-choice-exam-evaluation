import React, { useState } from "react";
import "./TestView.scss";
import { Checkbox, Button, Modal, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { testService } from "../../../../../services/testServices";
import { formatDate } from "../../../../../utils/tools";
import dayjs from "dayjs";
import useNotify from "../../../../../hooks/useNotify";
import { appPath } from "../../../../../config/appPath";
const TestView = ({
  questionList,
  testDay,
  testTime,
  duration,
  totalPoint
}) => {
  const [quesIds, setQesIds] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testId, setTestId] = useState(null);
  const [numberQues, setNumberQues] = useState(0);
  const onChange = (checkValues) => {
    setQesIds(checkValues);
    setNumberQues(checkValues.length);
    console.log(checkValues);
  };
  const navigate = useNavigate();
  const notify = useNotify();
  const onCreate = () => {
    setLoading(true);
    testService(
      {
        testDay: formatDate(testDay),
        testTime: dayjs(testTime, "HH:mm").format("HH:mm"),
        duration: Number(duration),
        totalPoint: Number(totalPoint),
        questionIds: quesIds,
      },
      (res) => {
        setOpenModal(true);
        setLoading(false);
        setTestId(res.data);
      },
      (error) => {
        setLoading(false);
        notify.error("Lỗi tạo đề thi");
      }
    );
  };
  const tagRender = (value, color) => {
    if (value === "EASY") {
      color = "green";
    } else if (value === "MEDIUM") {
      color = "geekblue";
    } else color = "volcano";
    return color;
  };
  const options = questionList.map((item, index) => {
    return {
      label: (
        <div className="question-items" key={index}>
          <div className="topic-level">
            <div className="question-topic">{`Câu ${index + 1}: ${
              item.topicText
            }`}</div>
            <Tag color={tagRender(item.level)}>{item.level}</Tag>
          </div>
          {item.answers &&
            item.answers.map((ans, ansNo) => {
              return (
                <div
                  className={
                    ans.isCorrected === "true"
                      ? "answer-items corrected"
                      : "answer-items"
                  }
                  key={`answer${ansNo}`}
                >
                  {`${String.fromCharCode(65 + ansNo)}. ${ans.content}`}
                </div>
              );
            })}
        </div>
      ),
      value: item.id,
    };
  });
  return (
    <div className="test-view">
      <div className="test-wrap">
        <div className="number-ques">{`Số lượng câu hỏi: ${numberQues}`}</div>
        <Checkbox.Group options={options} onChange={onChange} />
      </div>
      <Button
        loading={loading}
        type="primary"
        style={{ width: 100, height: 40 }}
        onClick={onCreate}
      >
        Tạo đề
      </Button>
      <Modal
        open={openModal}
        title="Tạo đề thi thành công!"
        onOk={() => navigate(`${appPath.testSetCreate}/${testId}`)}
        onCancel={() => setOpenModal(false)}
      >
        <p>Bạn có muốn tạo tập đề thi không?</p>
      </Modal>
    </div>
  );
};
export default TestView;
